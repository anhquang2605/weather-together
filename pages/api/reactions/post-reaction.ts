import {NextApiRequest, NextApiResponse} from "next";
import {connectDB} from "../../../libs/mongodb";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const reaction = req.body;
    const db = await connectDB();
    if (db) {
        const reactionsCollection = db.collection("reactions");
        reaction.createdDate = new Date();
        reaction.updatedDate = new Date();
        if(reaction.expireAt){
            reaction.expireAt = new Date(reaction.expireAt);
        }
        const result = await reactionsCollection.insertOne(reaction);
        if (result.insertedId) {
            res.status(201).json({message: "success"});
        }else {
            res.status(500).json({message: "failed"});
        }
        
    } else {
        res.status(500).json({message: "failed"})
    }
}