import { NextApiRequest,NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { commentId } = req.query;
    const db = await connectDB();
    if(db){
        const reactionsCollection = db.collection("reactions");
        const aggregation = [
            {
                $match: {
                    targetId: commentId
                }
            },
            {
                $group: {
                    _id: "$type",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]
        const reactions = await reactionsCollection.aggregate(aggregation).toArray();
        if(reactions && reactions.length > 0){
            res.status(200).json(reactions);
        }else{
            res.status(404).json({message: "No reactions found"});
        }
    }else{
        res.status(500).json({message: "Cannot connect to DB"})
    }
}