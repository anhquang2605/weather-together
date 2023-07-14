import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '../../../libs/mongodb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const db = await connectDB();
        const post = req.body;
        if(db){
           db.collection('posts').insertOne(post).then(result => {
            res.status(200).json(result);
           }).catch(err => {
            res.status(500).json({ error: 'DB connection error' });
           })
        }else {
            res.status(500).json({ error: 'DB connection error' });
        }
        
    } else {
    res.status(405).json({ error: 'Method not allowed' }); // Handle any other HTTP method
  }
}