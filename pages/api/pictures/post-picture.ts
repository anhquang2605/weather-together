import { NextApiRequest,NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectDB();
    const picture = JSON.parse(req.body);
    if(db){
        try{
            const result = await db.collection('pictures').insertOne(picture);
            res.status(200).json(result);
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(500).json({error: "Cannot connect to db"});
    }
}