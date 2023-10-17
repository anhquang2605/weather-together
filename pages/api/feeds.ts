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
            if(feeds.length > theLimit + 1){
                hasMore = true;
                feeds.pop();
            }
            let feedGroups = [];
            let curFeedGroupIndex = -1;
            let i = 0;
            for(const feed of feeds){
                const targetId = feed.targetId;
                const parentId = feed.targetParentId;
                let theParentId = parentId !== "" ? parentId : targetId;
                if(feedGroups[curFeedGroupIndex] && feedGroups[curFeedGroupIndex].targetContentId === theParentId && theParentId !== "" && curFeedGroupIndex !== -1){
                    if((feed.type === "comments" || feed.typ === "reaction") && feedGroups[curFeedGroupIndex].latestCreatedDate < feed.createdDate){
                        feedGroups[curFeedGroupIndex].latestCreatedDate = feed.createdDate;
                        feedGroups[curFeedGroupIndex].lastestActivityId = feed.type === "comments" ? feed.activityId : feed.targetId;
                        feedGroups[curFeedGroupIndex].latestIndex += 1;
                    }
                    feedGroups[curFeedGroupIndex].feeds.push(feed);
                }else{
                    let feedGroup = {
                        feeds: [feed],
                        targetContentId: theParentId,
                        latestCreatedDate: feed.createdDate,
                        lastestActivityId: (feed.type !== "comments" && feed.type !== "reaction") ? "" : feed.activityId,
                        latestIndex: 0,
                    }
                    feedGroups.push(feedGroup);
                    curFeedGroupIndex++;
                }
                
                i++;
            }
            // Get the list of usernames for which feeds were found
            res.status(200).json({ feedGroups, hasMore, success: true });
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