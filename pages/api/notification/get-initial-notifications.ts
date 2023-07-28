import { connectDB } from "../../../libs/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'
export default async (req: NextApiRequest, res:NextApiResponse) => {
    if (req.method === 'GET') {
        const db = await connectDB();
        if(db){
            const notificationsCollection = db.collection('notifications');
            const username = req.query.username;
            const limit = parseInt(req.query.limit as string);//can be the current number of notifications for the case when new notification is added
            const pageNo = parseInt(req.query.page as string);//can be the current page number or be one when new notification is added 
            const agg = {
                username: username,
            }
            const total = await notificationsCollection.countDocuments(agg);
            const results = await notificationsCollection.find(agg).sort({createdDate: -1}).skip(pageNo * limit).limit(limit).toArray(); 
            res.status(200).json({result: results, total: total});
        }else{
            res.status(500).json({ error: 'DB connection error' });
        }
        
    } else {
        res.status(405).json({ error: 'Method not allowed' }); // Handle any other HTTP method
    }
}