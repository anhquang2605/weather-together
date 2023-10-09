import { connectDB } from "../../libs/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'
interface FindArgs{
    username: string,
    createdDate?: {$lt: Date}
}
export default async (req: NextApiRequest, res:NextApiResponse) => {
    if (req.method === 'GET') {
        const db = await connectDB();
        if(db){
            const feeds = db.collection('feeds');
            const username = req.query.username as string;
            let theLimit;
            const limit = parseInt(req.query.limit as string);//can be the current number of notifications for the case when new notification is added
            const cursor = req.query.cursor as string;

            const cursorAt = cursor ? new Date(cursor as string) : new Date();
            const unread = req.query.unread === "true";
            
            let agg:FindArgs = {
                username: username,
                createdDate: {$lt: cursorAt}
            }
            if(!limit){
                theLimit = 10;
            }else{
                theLimit = limit;
            }
            const results = await feeds.find(agg).sort({createdDate: -1}).limit(theLimit + 1).toArray();
            const hasMore = results.length > theLimit;
            if(hasMore){
                results.pop();
            }
            if(results.length > 0){
                res.status(200).json({success: true, feeds:results, hasMore: hasMore});
            }else{
                res.status(200).json({success: false, message: "No more feeds"});
            }

        }else{
            res.status(500).json({ error: 'DB connection error' });
        }
        
    } else if (req.method === 'POST') {

    } else {
        res.status(405).json({ error: 'Method not allowed' }); // Handle any other HTTP method
    }
}