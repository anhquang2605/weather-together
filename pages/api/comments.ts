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
                      result = await commentsCollection.find({username,postId}).toArray();
                    } else if(username){
                      result = await commentsCollection.find({username}).toArray();
                    } else if(postId){
                      result = await commentsCollection.find({postId}).toArray();
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
            case 'POST':
                  const comment = req.body;
                  const result = await commentsCollection.insertOne(comment);
                   try {
                    res.status(200).json(result.insertedId.toString());
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