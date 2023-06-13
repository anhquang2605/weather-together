import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '../../libs/mongodb'
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const db = await connectDB();
        const username = req.query.username;
        let user = null;
        if(db){
            user = await db.collection('users').findOne({username });
        }
        if (user) {
        res.status(200).json({ user });
        } else {
        res.status(404).json({ error: 'User not found' });
        }
    } else {
    res.status(405).json({ error: 'Method not allowed' }); // Handle any other HTTP method
  }
}