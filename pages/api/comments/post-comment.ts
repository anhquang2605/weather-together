import {NextApiRequest, NextApiResponse} from 'next';
import { connectDB } from '../../../libs/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectDB();
    const comment = req.body;
    if(db){
        try{
            comment.createdDate = new Date();
            comment.updatedDate = new Date();
            const result = await db.collection('comments').insertOne(comment);
            res.status(200).json(result.insertedId.toString());
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(500).json({error: "Cannot connect to db"});
    }
    
}