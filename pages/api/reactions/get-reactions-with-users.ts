import { NextApiRequest,NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const { targetId, username, limit, lastCursor, name, isFriend } = req.query;
    const db = await connectDB();
    if(db){
        const reactionsCollection = db.collection("reactions");
        const theLimit = limit ? parseInt(limit as string) : 30;
        const aggregation = [
            {
                $match: {
                    targetId: targetId,
                    createdDate: {$lt: lastCursor ? new Date(lastCursor as string) : new Date()},
                    name: name !== "all" ? name : {$ne: ""},
                }
            },
           {
                $lookup: {
                    from: "users",
                    localField: "username",
                    foreignField: "username",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    targetId: 1,
                    username: "$user.username",
                    profilePicture: "$user.profilePicturePath",
                    name: 1,
                    createdDate: 1,
                    fullName: {$concat: ["$user.firstName", " ", "$user.lastName"]},
                }
            }, 
           {
                $lookup:{
                    from: 'friend_requests',
                    let: {username: "$username"},
                    pipeline: [//conditional join with this
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        {$and: [{$eq: ["$username", "$$username"]}, {$eq: ["$targetUsername", username]}]},
                                        {$and: [{$eq: ["$username", username]}, {$eq: ["$targetUsername", "$$username"]}]}
                                    ]
                                    
                                }
                            }
                        }
                    ],
                    as: "friend"
                }
            }, 
           {
                $project: {
                    targetId: 1,
                    username: 1,
                    fullName: 1,
                    profilePicture: 1,
                    name: 1,
                    createdDate: 1,
                    status: {$cond: {if: {$eq: [{$size: "$friend"}, 0]}, then: "none", else: {$arrayElemAt: ["$friend.status", 0]}}},
                }
            },
            {
                //get only when isFriend is true
                $match: {
                    status: isFriend === "true" ? 
                    {
                        $in: ["accepted", "pending"]
                    }
                    : "none"
                }
            },
            {
                $sort: {
                    createdDate: -1
                }
            },
            {
                $limit: theLimit + 1,
            }, 
/*             {
                $group: {
                    _id: "$isFriend",
                    reactions: {$push: "$$ROOT"},
                    usernames: {$push: "$username"},
                    count: {$sum: 1},
                }
            } */
        ]

        const results = await reactionsCollection.aggregate(aggregation).toArray();
       
        if(results){
            let hasMore = false;
            if(results.length > 0){
           /*      const friendTotal = results[0].count || 0;
                let nonFriendTotal = 0;
                if(results.length > 1){
                    nonFriendTotal = results[1].count;
                }
                const sumTotal = friendTotal + nonFriendTotal;
                hasMore = sumTotal > theLimit;
                if(hasMore){
                    if(friendTotal > theLimit){
                        results[0].reactions.pop();
                        results[0].count -= 1;
                        results[0].usernames.pop();
                    }else {
                        results[1].reactions.pop();
                        results[1].count -= 1;
                        results[1].usernames.pop();
                    }
                }    */
                hasMore = results.length > theLimit;
            }
            if(hasMore){
                results.pop();
            }
            res.status(200).json({
                success: true,
                data: {
                    results,
                    hasMore,
                }   
            })
        }else{
            res.status(404).json({message: "Cannot find reactions"});
        }


       
    }else{
        res.status(500).json({message: "Cannot connect to DB"})
    }
}
