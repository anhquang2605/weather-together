import { NextApiRequest,NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
import { ObjectId } from "mongodb";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectDB();
    const _id = req.query._id as string;
    if(db){
        try{
            const result = await db.collection('pictures').deleteOne({_id: new ObjectId(_id)});
            res.status(200).json(result);
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(500).json({error: "Cannot connect to db"});
    }
}