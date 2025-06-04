import { ObjectId } from "mongodb";
import { connectDB } from "../../libs/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'
interface FindArgs{
    username: string,
    createdDate?: {$lt: Date}
}
export default async (req: NextApiRequest, res:NextApiResponse) => {
    const db = await connectDB();
    if(db){
        //GET feeds using usernames
        if (req.method === 'GET') {
            // Assuming you pass an array of usernames as a query parameter
            let usernamesString = req.query.usernames as string;
            let username = req.query.username as string;
            let usernames:String[] = [];
            if(usernamesString && usernamesString.length > 0){
                usernames = usernamesString.split(',');
            }
            usernames.push(username)
            let cursor = req.query.cursor as string;
            let limit =  req.query.limit as string;
            const theLimit = limit? parseInt(limit): 10;
            // Fetch the latest feeds where the username is either the issuer or the target
            const aggregate = [
                {
                    $match: {// find filters relating to the users in provided list
                       // isDeleted: {$ne: true},
                        createdDate: { $lt: 
                            cursor && cursor.length > 0 ?
                            new Date(cursor) :
                            new Date() 
                        },
                        $or: [
                            { username: { 
                                $in: usernames 

                            } },
                            { relatedUser: { $in: usernames } },
                        ],
                        hiddenBy: { $nin: [username]}
                    },
                },
                { $sort: { createdDate: -1 } },
                // Branch the pipeline: one for post_tag grouping, one for others
               {
                    $facet: {
                        postTags: [
                            {
                                $match: { type: "post_tag" }
                            },
                            {
                                $group: {
                                    _id: "$activityId",
                                    createdDate: { $first: "$createdDate" },
                                    type: { $first: "$type" },
                                    relatedUsers: { $push: "$relatedUser" },
                                    username: { $first: "$username" }
                                }
                            },
                            {
                                $project: {
                                    activityId: "$_id",
                                    username: 1,
                                    createdDate: 1,
                                    type: 1,
                                    relatedUsers: 1,
                                    _id: 0
                                }
                            }
                        ],
                        otherFeeds: [
                            {
                                $match: { type: { $ne: "post_tag" } }
                            }
                        ]
                    }
                },
                // Combine the two branches
                {
                    $project: {
                        combinedFeeds: { $concatArrays: ["$postTags", "$otherFeeds"] }
                    }
                },
                {  
                    $unwind: "$combinedFeeds" 
                },
                {
                    $replaceRoot: { newRoot: "$combinedFeeds" } 
                },
                {
                    $limit: theLimit + 1
                },
                { $sort: { createdDate: -1 } },
            ]
            const feeds = await db
                .collection("feeds")
                .aggregate(aggregate)
                .toArray();
            if (feeds.length === 0) {
                res.status(200).json({
                    success: true,
                    feeds: [],
                    hasMore: false,     
                });
                return;
            }
            let hasMore = false;  
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
                if(feed.type === "posts" || feed.type === "post_tag"){
                    theParentId = feed.activityId;
                }
                let theContentIndex = contentIdToIndex.get(theParentId);
               
                if(theContentIndex !== undefined && theParentId !== "" && curFeedGroupIndex !== -1){
                    let theGroup = feedGroups[theContentIndex];
                    //priority: comments, then createdDate, if the latest is a reation that target a post, then it is replaced by other activity, if the latest is a reaction that target a comment, then it is not replaced
                    if((feed.type === "comments" || feed.type === "reaction") && (theGroup.lastestActivityId === "" || theGroup.latestCreatedDate < feed.createdDate)){
                                theGroup.latestCreatedDate = feed.createdDate;
                                theGroup.lastestActivityId = feed.type === "comments" ? feed.activityId : "";
                                theGroup.latestIndex += 1;
                    }
                    theGroup.feeds.push(feed);
                }else{
                    let theContentId = (feed.type === "posts" || feed.type === "post_tag") ? feed.activityId : theParentId;
                   
                    let feedGroup = {
                        feeds: [feed],
                        targetContentId: theContentId,
                        latestCreatedDate: feed.createdDate,
                        lastestActivityId: (feed.type !== "comments" 
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
            if(feedGroups.length > 0){
                res.status(200).json({
                    success: true,
                    feedGroups: feedGroups,
                    hasMore: hasMore,
                    lastCursor: lastCursor,
                    message: "Feeds fetched successfully"
                });
            } else {
                res.status(500).json({ success: false, message: "Database error" });
            }
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
            if(results.length > 0){
                res.status(200).json({success: true, feeds:results});
            }else if(results.length === 0){
                res.status(200).json({success: true, feeds: [], hasMore: false, message: "No more feeds"});
            } else {
                res.status(500).json({success: false, message: "Database error"});
            }
        } else if (req.method === 'DELETE') {
            //delete all feeds associated with the activityId (post, post_tag, comment, reaction)
            const {activityId, feedIds, type} = req.query;
            if(activityId && typeof activityId === 'string'){
                const result = await db.collection('feeds').deleteMany({activityId: activityId});
                if(result.deletedCount > 0){
                    res.status(200).json({success: true, data: result.deletedCount});
                }else{
                    res.status(404).json({success: false, error: 'Not Found'});
                }
            } else if(feedIds && typeof feedIds === 'string'){
                const feedIdArray = feedIds.split(',');
                const objectIds = feedIdArray.map((id)=>{return new ObjectId(id)});
                //update many
                const result = await db.collection('feeds').updateMany({_id: {$in: objectIds}}, {$set: {isDeleted: true}});
                if(result.modifiedCount > 0){
                    res.status(200).json({success: true, data: {modifiedCount: result.modifiedCount}});
                } else {
                    res.status(200).json({success: false, data: {modifiedCount: 0}});
                }
            } else {
                res.status(400).json({success: false, error: 'Bad Request'});
            }
        } else if (req.method === 'PUT') {
            const {feedIds, } = req.body;

        } else {
            res.status(405).json({ error: 'Method not allowed' }); // Handle any other HTTP method
        }
    }else{
        res.status(500).json({ error: 'DB connection error' });
    }
}