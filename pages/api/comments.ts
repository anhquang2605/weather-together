import {NextApiRequest, NextApiResponse} from 'next'
import { connectDB } from '../../libs/mongodb'
import { Collection, WithId } from 'mongodb';
import { Comment } from '../../types/Comment';
import { CommentChildrenSummary } from '../../types/CommentChildrenSummary';
import { type } from 'os';
interface IMatch{
  targetId?: string;
  level?: number;
  postId?: string;
  username?: string;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectDB();
    const {method} = req 
    if(db){
        const commentsCollection:Collection<Comment>= db.collection('comments');
        switch(method){
            case 'GET':
                const {username,postId, level, targetId} = req.query;
                try {
                    let result:WithId<Comment>[] =[];
                    let children:CommentChildrenSummary = {};
                    
                    if(username && postId){
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
                      if(targetId === "" && postId){
                        match.postId = postId.toString();
                        match.level = 0;
                      }
                      result = await commentsCollection.find(match).toArray();
                      for(let i = 0; i < result.length; i++){
                        const commentId = result[i]._id.toString();
                        const childrenNo = await commentsCollection.countDocuments({targetId: commentId});
                        children[commentId] = childrenNo;
                      }
                    } 
                    else if(postId){
                      result = await commentsCollection.find({postId:postId.toString()}).toArray();
                    } 
                    if(result.length > 0){
                      const listOfUsernames = result.map((comment) => comment.username);
                      const uniqueUsernames = [...new Set(listOfUsernames)];
                      res.status(200).json({
                        success: true,
                        data: {result, commentors: uniqueUsernames, children},
                      });
                    }else{
                      res.status(404).json({
                        success: false,
                        error: 'Not Found',
                      });
                    }
                    
                 } catch (error) {
                  res.status(500).json({
                    success: false,
                    error: 'Server Error',
                  });
                 }
              break;
            case 'POST':
                  const comment = req.body;
                  try{
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