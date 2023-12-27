import {NextApiRequest, NextApiResponse} from 'next';
import { connectDB } from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db  = await connectDB();
  const { id } = req.query;
  if(!db) return res.status(400).json({ success: false, message: 'Database connection error' });
  if(req.method !== 'DELETE') return res.status(400).json({success: false, message: 'Method not allowed' });
  if(!id || typeof id !== 'string') return res.status(400).json({ success:false, message: 'Id not found' });
  try {
    await db.collection('posts').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ success: true, message: 'Delete success' });
  } catch (error) {
    res.status(400).json({ success:false, message: 'Delete failed' });
  }
};