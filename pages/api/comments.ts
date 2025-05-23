import { Collection, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../libs/mongodb';
import { Comment } from '../../types/Comment';
import { CommentChildrenSummary } from '../../types/CommentChildrenSummary';
import { deleteFromDeleteAPI, insertToPostAPI } from '../../libs/api-interactions';
import { is } from 'date-fns/locale';
interface IMatch{
  targetId?: string;
  level?: number;
  postId?: string;
  username?: string;
  createdDate?: {$lt: Date};
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectDB();
    const {method} = req 
    if(db){
        const commentsCollection:Collection<Comment>= db.collection('comments');
        switch(method){
            case 'GET':{
                const {username,postId, level, targetId, limit, lastCursor, _id,isGettingCounts} = req.query;
                try {
                    let result:Comment[] =[];
                    let children:CommentChildrenSummary = {};
                    if(_id){
                      result = await commentsCollection.find({_id: new ObjectId(_id as string)}).toArray();
                      if(result.length > 0){
                        let resultArr = [result[0]];
                        let curLevel = result[0].level;
                        let curComment = result[0];
                        let uniqueUsernames = new Set().add(curComment.username);
                        while(curLevel){
                          const parentId = curComment.targetId;    
                          const parent = await commentsCollection.find({_id: new ObjectId(parentId as string)}).toArray();
                          const commentId = parent[0]?._id?.toString() || "";
                          children[commentId] = 1;
                          resultArr.push(parent[0]);
                          curComment = parent[0];
                          uniqueUsernames.add(curComment.username);
                          curLevel--;
                          
                        }                       
                        const commentId = result[0]?._id?.toString() || "";
                        const childrenNo = await commentsCollection.countDocuments({targetId: commentId});
                        children[commentId] = childrenNo;
                        res.status(200).json({
                          success: true,
                          data: {result: resultArr, commentors: Array.from(uniqueUsernames), children, previewOnly: true},
                        });
                      }else{
                        res.status(200).json({
                          success: false,
                          message: 'Not Found',
                        });
                      }
                      return;
                    }
                    else if(username && postId){
                      result = await commentsCollection.find({username,postId: postId.toString()}).toArray();
                    } 
                    else if(username){
                      result = await commentsCollection.find({username}).toArray();
                    }
                    else if(typeof targetId === 'string'){
                      //get all comments based on targetId
                      const match:IMatch = {
                        targetId: targetId,
                      }
                      if(lastCursor && typeof lastCursor === 'string'){
                        match.createdDate = {$lt: new Date(lastCursor as string)};
                      }
                      if(targetId === "" && postId){
                        match.postId = postId.toString();
                        match.level = 0;
                      }
                      if(limit){
                          const limitNo = parseInt(limit.toString());
                          result = await commentsCollection.find(match).sort({createdDate: -1}).limit(limitNo).toArray();
                      }else{
                        result = await commentsCollection.find(match).sort({createdDate: -1}).toArray();
                      }
  
                      for(let i = 0; i < result.length; i++){
                        const commentId = result[i]?._id?.toString() || "";
                        const childrenNo = await commentsCollection.countDocuments({targetId: commentId});
                        children[commentId] = childrenNo;
                      }

                    } 
                    else if(postId){
                      if(isGettingCounts){
                        const count = await commentsCollection.countDocuments({postId: postId.toString()});
                        res.status(200).json({
                          success: true,
                          data: {count},
                        });
                        return;
                      }
                      result = await commentsCollection.find({postId:postId.toString()}).toArray();
                    } else {
                      res.status(400).json({
                        success: false,
                        error: 'Invalid query',
                      })
                    } 

                    if(result.length > 0){
                      const listOfUsernames = result.map((comment) => comment.username);
                      const cursor = result[result.length - 1].createdDate.toISOString();
                      const uniqueUsernames = [...new Set(listOfUsernames)];
                      res.status(200).json({
                        success: true,
                        data: {result, commentors: uniqueUsernames, children, lastCursor: cursor},
                      });
                    }else if(result.length === 0){
                      res.status(200).json({
                        success: false,
                        data: {result, commentors: [], children},
                      });
                    }else{
                      res.status(200).json({
                        success: false,
                        data: null,
                        message: 'Not Found',
                      });
                    }
                    
                 } catch (error) {
                  res.status(500).json({
                    success: false,
                    error: 'Server Error',
                  });
                 }}
              break;
            case 'POST':
                  {const comment = req.body;
                  try{
                    comment.createdDate = new Date();
                    comment.updatedDate = new Date();
                    const result = await commentsCollection.insertOne(comment);
                    if(result.insertedId){
                        res.status(201).json({
                          success: true,
                          data: {id: result.insertedId.toString()}
                        });
                    }
                   } catch (error) {
                    res.status(500).json({
                      success: false,
                      error: 'Server Error',
                    });
                   }}
                break;
            case 'PUT':

                break;
            case 'DELETE':
              //delete comments by postId ensure that the comments and children comments are deleted
              //NOTE: need to set up a trigger to delete all associated reactions, feeds, notifications, activities, and pictures (if pictureAttached is true) associated with the comment
              {
                const {postId} = req.query;
                if(postId && typeof postId === 'string'){
                  const match = {
                    postId: postId
                  }
                    const comments = await commentsCollection.find(match).project({
                      _id: 1
                    }).toArray();
                    const commentIds = comments.map((comment) => comment._id.toString());

                    if(commentIds.length > 0){
                      try{
                        //delete reactions
                        await db.collection('reactions').deleteMany({targetId: {$in: commentIds}});
                        //delete reactions feeds and notifications
                      //delete feeds

                        await db.collection('feeds').deleteMany({targetId: { $in: commentIds}, type: 'reaction'});
                        //delete notifications
                        await db.collection('notifications').deleteMany({reference_id: { $in:  commentIds}, type: 'reactions'});
                        //delete pictures
                        const picturePath = 'pictures/delete-by-targetIds';
                        const params = {
                          targetIds: commentIds
                        }
                        await insertToPostAPI(picturePath, params);
                        //delete feeds and notifications
                        await db.collection('feeds').deleteMany({activityId: { $in: commentIds}});
                        //delete notifications
                        await db.collection('notifications').deleteMany({reference_id: { $in:  commentIds}});
                        //delete the comments themselves
                        const result = await commentsCollection.deleteMany(match);
                        
                        res.status(200).json({
                          success: true,
                          data: {deletedCount: result.deletedCount}
                        });
                      }catch(e){
                        console.log(e);
                        res.status(500).json({
                          success: false,
                          error: 'Server Error',
                        })
                        return;
                      }                    
                  } else {
                    res.status(200).json({
                      success: true,
                     data: {deletedCount: 0}
                    });
                  }
                } else {
                  res.status(400).json({
                    success: false,
                    message: "invalid query"
                  });
                }  
              
                break;
            }
            default:
                res.status(400).json({error: "Invalid method"});
                break;
        }
    }else{
        res.status(500).json({error: "Cannot connect to db"});
    }
}