import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectDB();
    const method = req.method;
    const picturePaths: string[] = req.body; 
    console.log(method, picturePaths)
    if (method !== 'POST'){
        res.status(400).json({error: 'Method not allowed'});
        return;
    }
    if (!db){
        res.status(500).json({error: "Cannot connect to db"});
        return;
    }
    if (!picturePaths || picturePaths.length === 0){
        res.status(400).json({error: "No pictures provided"});
        return;
    }
    try{
        const result = await db.collection('pictures').deleteMany({picturePath: {$in: picturePaths}});
        res.status(200).json(result);
    } catch(err){
        res.status(500).json(err);
    }
}