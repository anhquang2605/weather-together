import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {targetId} = req.query;
    const db = await connectDB();
    if (db) {
        const reactionsCollection = db.collection("reactions");
        const match = {
            targetId: targetId,
        }
        const reactions = await reactionsCollection.find(match).toArray();
        if (reactions && reactions.length > 0) {
            res.status(200).json(reactions);
        } else {
            res.status(404).json({message: "No reactions found"});
        }
    } else {
        res.status(500).json({message: "Cannot connect to DB"})
    }
}