import {NextApiRequest, NextApiResponse} from 'next'
import { connectDB } from '../../libs/mongodb'
import { Collection, WithId } from 'mongodb';
import { Comment } from '../../types/Comment';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectDB();
    const {method} = req 
    if(db){
        const commentsCollection:Collection<Comment>= db.collection('comments');
        switch(method){
            case 'GET':
                const {username,postId} = req.query;
                try {
                    let result:WithId<Comment>[] =[];
                    if(username && postId){
                      result = await commentsCollection.find({username,postId: postId.toString()}).toArray();
                    } else if(username){
                      result = await commentsCollection.find({username}).toArray();
                    } else if(postId){
                      result = await commentsCollection.find({postId:postId.toString()}).toArray();
                    }
                    if(result.length > 0){
                      res.status(200).json({
                        success: true,
                        data: result,
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

                break;
            default:
                res.status(400).json({error: "Invalid method"});
                break;
        }
    }else{
        res.status(500).json({error: "Cannot connect to db"});
    }
}