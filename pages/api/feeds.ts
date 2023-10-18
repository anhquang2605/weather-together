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
/*                 {
                    $group: {
                        _id: {
                            targetId: "$targetId",
                            targetParentId: "$targetParentId",
                        },
                        latestDocument: { $first: "$$ROOT" }
                    }
                }, 
                 {
                    $replaceRoot: { newRoot: "$latestDocument" } // Replace the root with the latest document
                  },  */
                  {
                    $limit: theLimit + 1
                  },
                //put the document whose username is equal to the username at the top, then sort by createdDate
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
            feeds.sort((a,b)=>{
                if (a.username === username) return -1;
                if (b.username === username) return 1;
                return 0;
            })
            if(feeds.length > theLimit ){
                hasMore = true;
                feeds.pop();
            }
            let lastCursor = feeds[feeds.length - 1].createdDate;
            let feedGroups = [];
            let contentIdToIndex = new Map<string,number>(
            );
            contentIdToIndex.set("", 0);
            let curFeedGroupIndex = -1;
            let i = 0;
            for(const feed of feeds){
                const targetId = feed.targetId;
                const parentId = feed.targetParentId;
                let theParentId = parentId !== "" ? parentId : targetId;
                if(feed.type === "post" || feed.type === "post_tag"){
                    theParentId = feed.activityId;
                }
                let theContentIndex = contentIdToIndex.get(theParentId);
                if(theContentIndex !== undefined && theParentId !== "" && curFeedGroupIndex !== -1){
                    if((feed.type === "comments" || feed.type === "reaction") && feedGroups[theContentIndex].latestCreatedDate > feed.createdDate){
                        feedGroups[theContentIndex].latestCreatedDate = feed.createdDate;
                        feedGroups[theContentIndex].lastestActivityId = feed.type === "comments" ? feed.activityId : feed.targetId;
                        feedGroups[theContentIndex].latestIndex += 1;
                    }
                    feedGroups[theContentIndex].feeds.push(feed);
                }else{
                    let theContentId = (feed.type === "posts" || feed.type === "post_tag") ? feed.activityId : theParentId;
                   
                    let feedGroup = {
                        feeds: [feed],
                        targetContentId: theContentId,
                        latestCreatedDate: feed.createdDate,
                        lastestActivityId: (feed.type !== "comments" && feed.type !== "reaction" 
                        ) ? "" : feed.activityId,
                        latestIndex: 0,
                    }
                    feedGroups.push(feedGroup);
                    curFeedGroupIndex++;
                    if(theContentId !== ""){
                        contentIdToIndex.set(theContentId, curFeedGroupIndex);
                    }
                }
                
                i++;
            }
            // Get the list of usernames for which feeds were found
            res.status(200).json({ feedGroups, hasMore, success: true, lastCursor });
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