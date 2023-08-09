import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../libs/mongodb';

export default async function handler (req: NextApiRequest, res: NextApiResponse){
  const db = await connectDB();
  const body = req.body;
  if(db){
   try {
    res.status(200).json({
      success: true,
      data: {},
    });
   } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
   }
  }else{
   res.status(500).json({
    success: false,
    error: 'Server Error',
   });
  };
}