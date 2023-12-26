import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const  db  = await connectDB();
  const post = req.body;
  const method = req.method;
  if(method === 'PUT'){
    if(db){
        if(post){
          const {_id , ...rest} = post;
            const result = await db.collection('posts').updateOne({_id: new ObjectId(_id)}, {$set: rest}, {upsert: true});
            if(result.modifiedCount === 1){
                res.status(200).json({success: true, message: 'Post updated', insertedId: post._id});
            }else{
                res.status(200).json({success: false, message: 'Post not updated'});
            }
        } else {
            res.status(400).json({message: 'Post not provided'});
        }
        
    }else {
        res.status(500).json({message: 'Database connection failed'});
    }
   
  }else {
    res.status(400).json({message: 'Method not allow'});
  }


}
