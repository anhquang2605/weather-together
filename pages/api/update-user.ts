import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '../../libs/mongodb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'PUT') {
        const db = await connectDB();
        const {_id, ...user} = req.body;
        if(db){
           try{
            const result = await db.collection('users').updateOne({username: user.username}, {$set: user})
            console.log(result)
            res.status(200).json(result);
           }catch(err){
            res.status(500).json({ error: 'DB connection error' });
           }
        }else {
            res.status(500).json({ error: 'DB connection error' });
        }
        
    } else {
    res.status(405).json({ error: 'Method not allowed' }); // Handle any other HTTP method
  }
}