import {NextApiRequest, NextApiResponse} from 'next'
import { connectDB } from '../../libs/mongodb'
import { Collection, ObjectId, WithId } from 'mongodb';
import { Comment } from '../../types/Comment';
import { CommentChildrenSummary } from '../../types/CommentChildrenSummary';
import { type } from 'os';
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
            case 'GET':
                const {username,postId, level, targetId, limit, lastCursor, _id } = req.query;
                try {
                    let result:Comment[] =[];
                    let children:CommentChildrenSummary = {};
                    if(_id){
                      console.log(_id);
                      result = await commentsCollection.find({_id: new ObjectId(_id as string)}).toArray();
                      if(result.length > 0){
                        if(result[0].level = 2){
                            const uniqueUsernames = new Set();
                            const parentId = result[0].targetId;
                            console.log(parentId);
                            const parent = await commentsCollection.find({_id: new ObjectId(parentId as string)}).toArray();

                            if(parent){
                              uniqueUsernames.add(parent[0].username);
                              const grandParentId = parent[0].targetId;
                               const grandParent = await commentsCollection.find({_id: new ObjectId(grandParentId as string)}).toArray();
                              if(grandParent){
                                uniqueUsernames.add(grandParent[0].username);
                                uniqueUsernames.add(result[0].username);
                                const resultArr = [grandParent[0], parent[0], result[0]];
                                res.status(200).json({
                                  success: true,
                                  data: {result: resultArr, commentors: uniqueUsernames},
                                })
                                return;
                              } 
                            }
                            res.status(200).json({
                              success: false,
                              data: {result: [], commentors: uniqueUsernames},
                            })
                          }else{
                              const commentId = result[0]?._id?.toString() || "";
                              const childrenNo = await commentsCollection.countDocuments({targetId: commentId});
                              children[commentId] = childrenNo;
                            
                          }
                      }
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
                      result = await commentsCollection.find({postId:postId.toString()}).toArray();
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
                        success: true,
                        data: {result, commentors: [], children},
                      });
                    }else{
                      res.status(200).json({
                        success: false,
                        message: 'Not Found',
                      });
                    }
                    
                 } catch (error) {
                  console.log(error);
                  res.status(500).json({
                    success: false,
                    error: 'Server Error',
                  });
                 }
              break;
            case 'POST':
                  const comment = req.body;
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
                   }
                break;
            case 'PUT':

                break;
            case 'DELETE':
  /*   
  const docId = changeEvent.documentKey._id.toString(0);
  const FullDocument = changeEvent.FullDocument;
  const commentLevel = fullDocument.level;
  const theDb = context.services.get("Cluster0").db("weather");
  const commentCollection = theDb.collection("comments");
  if(commentLevel <= 1){
    const childrenLevel = commentLevel + 1;
    await commentCollection.deleteMany({
      "level": childrenLevel,
      "targetId": docId,
    })
  } */
                break;
            default:
                res.status(400).json({error: "Invalid method"});
                break;
        }
    }else{
        res.status(500).json({error: "Cannot connect to db"});
    }
}