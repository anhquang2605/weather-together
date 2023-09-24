import { NextApiRequest,NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
import { use } from "react";
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
                    username: {$ne: username},
                    createdDate: {$lt: lastCursor ? new Date(lastCursor as string) : new Date()},
                    name: name ? name : {$ne: ""},
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
                }
            }, 
           {
                $lookup:{
                    from: 'friends',
                    let: {username: "$username"},
                    pipeline: [//conditional join with this
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {$eq: ["$username", "$$username"]},
                                        {$eq: ["$friendUsername", username]}
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
                    profilePicture: 1,
                    name: 1,
                    createdDate: 1,
                    isFriend: {$cond: {if: {$eq: [{$size: "$friend"}, 0]}, then: false, else: true}}
                }
            },
            {
                //get only when isFriend is true
                $match: {
                    isFriend: isFriend === "true" ? true : false
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

/**
 * Problem: you want to fetch friends first then non-friends, ofcourse within the limit
 * with last cursor continue where you left off, but only persist to the last cusor of the friend group if the friend groups exceed the limit, the other case is simpler if the friend group is exhausted, then you just need to pop the last cursor of the non-friend group
 * so we should save the cursor of two groups, if group 1 exceed the limit, then we continue using the last cusor for the group 1,
 * The next time we fetch, we will use the last cursor of the group 1, and the last cursor of the group 2 
 */