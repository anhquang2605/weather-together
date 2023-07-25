import { connectDB } from "../../../libs/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'
export default async (req: NextApiRequest, res:NextApiResponse) => {
    if (req.method === 'GET') {
        const db = await connectDB();
        if(db){
            const notificationsCollection = db.collection('notifications');
            const username = req.query.username;
            const agg = {
                username: username,
            }
            const results = await notificationsCollection.find(agg).toArray(); 
            res.status(200).json(results);
        }else{
            res.status(500).json({ error: 'DB connection error' });
        }
        
    } else {
        res.status(405).json({ error: 'Method not allowed' }); // Handle any other HTTP method
    }
}