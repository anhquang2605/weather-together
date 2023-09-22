import { NextApiRequest,NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const { targetId } = req.query;
    const db = await connectDB();
    if(db){
        const reactionsCollection = db.collection("reactions");
        const aggregation = [
            {
                $match: {
                    targetId: targetId
                }
            },
            {
                $group: {
                    _id: "$name",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]
        const reactionsGroups = await reactionsCollection.aggregate(aggregation).toArray();
        let renamedGroup;
        if(reactionsGroups.length > 0){
            renamedGroup = reactionsGroups.map((reactionGroup) => {
                return {
                    name: reactionGroup._id,
                    count: reactionGroup.count
                }
            })
        }


        if(renamedGroup){
            res.status(200).json(renamedGroup);
        }else{
            res.status(200).json(null);
        }
    }else{
        res.status(500).json({message: "Cannot connect to DB"})
    }
}