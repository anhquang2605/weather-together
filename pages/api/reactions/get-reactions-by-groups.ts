import { NextApiRequest,NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
import { use } from "react";
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
                    },
                    usernames: {
                        $push: "$username"
                    }
                }
            }
        ]
        const reactionsGroups = await reactionsCollection.aggregate(aggregation).toArray();

        let renamedGroup;
        let usernames:string[] = [];
        if(reactionsGroups.length > 0){
            renamedGroup = reactionsGroups.map((reactionGroup) => {
                usernames = [...usernames, ...reactionGroup.usernames];
                return {
                    name: reactionGroup._id,
                    count: reactionGroup.count,
                    usernames: reactionGroup.usernames
                }
            })
        }

        if(reactionsGroups.length > 0){
            res.status(200).json(
                { renamedGroup,
                  usernames}
                );
        }else if(reactionsGroups.length === 0){
            res.status(200).json({
                renamedGroup: [],
                usernames: []
            });
        } else {
            res.status(200).json({success: false, message: "Cannot find reactions"})
        }
    }else{
        res.status(500).json({message: "Cannot connect to DB"})
    }
}