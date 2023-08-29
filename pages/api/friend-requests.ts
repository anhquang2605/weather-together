import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../libs/mongodb'
import { Collection, ObjectId, WithId } from 'mongodb';
import {FriendRequest} from '../../types/FriendRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const db = await connectDB();
    if(db){
        const friend_requests: Collection<FriendRequest> = db.collection('friend_requests');
        switch (method) {
            case 'GET':
                
                break;
            case 'POST':
                var {sender, receiver} = req.body;
                const new_friend_request = {
                    username: sender,
                    createdDate: new Date(),
                    targetUsername: receiver,
                    updatedDate: new Date(),
                    status: 'pending'
                }
                try{
                    await friend_requests.insertOne(new_friend_request);
                    res.status(200).json({
                        success: true
                    });
                }catch(err){
                    res.status(500).json({
                        success: false,
                        error: 'Server Error',
                    });
                }
  
                break;
            case 'PUT':
                var {sender, receiver, status} = req.body;
                const updatedFriendRequest = {
                    status: status,
                    updatedDate: new Date()
                }
                try {
                    await friend_requests.updateOne({username: sender, targetUsername: receiver}, {$set: updatedFriendRequest});
                    res.status(200).json({
                        success: true
                    });
                } catch (error) {
                  console.log(error);
                  res.status(500).json({
                    success: false,
                    error: 'Server Error',
                  });
                }

                break;
            case 'DELETE':
                
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method method Not Allowed`);
                break;
        }
    } else {
        res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    }
}