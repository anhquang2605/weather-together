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
            const notificationsCollection = db.collection('notifications');
            const username = req.query.username as string;
            const limit = parseInt(req.query.limit as string);//can be the current number of notifications for the case when new notification is added
            const cursorAt = new Date(req.query.cursor as string);
            const unread = req.query.unread === "true";
            
            let agg:FindArgs = {
                username: username,
            }
            if(cursorAt){
                agg.createdDate = {$lt: cursorAt}
            }
            const results = await notificationsCollection.find(agg).sort({createdDate: -1}).limit(limit + 1).toArray();
            const hasMore = results.length > limit;
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
        
    } else {
        res.status(405).json({ error: 'Method not allowed' }); // Handle any other HTTP method
    }
}