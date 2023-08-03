import { NextApiRequest,NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const {targetId, username} = req.query;
    const db = await connectDB();
    if(db){
        const reactionsCollection = db.collection("reactions");
        const match = {
            username: username,
            targetId: targetId,
        }
        const reaction = await reactionsCollection.findOne(match);
        if(reaction){
            res.status(200).json(reaction);
        }else{
            res.status(404).json({message: "No reaction found"});
        }
    } else{
        res.status(500).json({message: "Cannot connect to DB"})
    }
}