import { connectDB } from "../../libs/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'
interface FindArgs{
    username: string,
    createdDate?: {$lt: Date}
}
export default async (req: NextApiRequest, res:NextApiResponse) => {
    const db = await connectDB();
    if(db){
        if (req.method === 'GET') {
            // Assuming you pass an array of usernames as a query parameter
            let usernamesString = req.query.usernames as string;
            let username = req.query.username as string;
            let usernames:String[] = [];
            if(usernamesString && usernamesString.length > 0){
                usernames = usernamesString.split(',');
            }
            let cursor = req.query.cursor as string;
            let limit =  req.query.limit as string;
            const theLimit = limit? parseInt(limit): 10;
            // Fetch the latest feeds where the username is either the issuer or the target
            const aggregate = [
                {
                    $match: {
                        $or: [
                            { username: { 
                                $in: usernames 

                            } },
                            { relatedUser: { $in: usernames } },
                        ],
                        createdDate: { $lt: 
                            cursor && cursor.length > 0 ?
                            new Date(cursor) :
                            new Date() 
                        },
                    },
                },
                { $sort: { createdDate: -1 } },
                {
                    $group: {
                        _id: {
                            targetId: '$targetId',
                            username: '$username',
                            targetParentId: '$targetParentId',
                        },
                        latestDocument: { $first: "$$ROOT" }
                    }
                },
                {
                    $replaceRoot: { newRoot: "$latestDocument" } // Replace the root with the latest document
                  },
                  {
                    $limit: theLimit + 1
                  },
                //put the document whose username is equal to the username at the top, then sort by createdDate
                {
                    $sort: {
                        username: { $eq: username } ? 1 : -1,
                    }
                }
            ]
            const feeds = await db
                .collection("feeds")
                .aggregate(aggregate)
                .toArray();
            if (feeds.length === 0) {
                res.status(200).json({
                    success: false,
                    feeds: [],
                    hasMore: false,     
                });
                return;
            }
           
            let hasMore = false;
            let feedGroups = [];
            let curFeedGroupIndex = 0;
          
            for(const feed of feeds){
                const targetId = feed.targetId;
                const parentId = feed.targetParentId;
                if(targetId === "" && parentId === ""){
                    let feedGroup = {
                        feeds: [feed],
                        targetContentId: "",
                    }
                    feedGroups.push(feedGroup);
                    curFeedGroupIndex++;
                }else{
                    //if the feed has the same targetContentId with the current group, add it to the group, else create a new group and add it to the group
                    let theParentId = parentId !== "" ? parentId : targetId;
                    if(feedGroups[curFeedGroupIndex] && feedGroups[curFeedGroupIndex].targetContentId === theParentId){
                        feedGroups[curFeedGroupIndex].feeds.push(feed);
                    }else{
                        let feedGroup = {
                            feeds: [feed],
                            targetContentId: theParentId,
                        }
                        feedGroups.push(feedGroup);
                        curFeedGroupIndex++;
                    }
                }
            }
            console.log(feedGroups);
            if(feeds.length > theLimit + 1){
                hasMore = true;
                feeds.pop();
            }


            // Get the list of usernames for which feeds were found
            res.status(200).json({ feeds, hasMore, success: true });
        } else if (req.method === 'POST') {
            const usernames = req.body;
            const feeds = db.collection('feeds');
            const agg = [
                {
                    $match: {
                        $or: [
                            {relatedUser: {$in: usernames}},
                           { username: {$in: usernames}}
                        ]
                    }
                }
            ]
            const results = await feeds.aggregate(agg).toArray();
            if(results.length >= 0){
                res.status(200).json({success: true, feeds:results});
            }else{
                res.status(200).json({success: false, feeds: [], hasMore: false, message: "No more feeds"});
            }
        } else {
            res.status(405).json({ error: 'Method not allowed' }); // Handle any other HTTP method
        }
    }else{
        res.status(500).json({ error: 'DB connection error' });
    }
}