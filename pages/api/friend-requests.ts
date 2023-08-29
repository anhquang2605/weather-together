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
                const {username, lastCursor, limit, active} = req.query;
                const fieldToMatch = active === 'true' ? 'username' : 'targetUsername';
                const fieldToLookup = active === 'true' ? 'targetUsername' : 'username';
                const lookupAs = active === 'true' ? 'senderUser' : 'receiverUser';
                console.log(username, lastCursor, limit, active);
                try{
                    const active_aggregate = [
                        {
                          $match: {
                            [fieldToMatch]: username,
                            createdDate: {
                              $lt: lastCursor ? new Date(lastCursor as string) : new Date()
                            }
                          }
                        },
                        {
                          $limit: parseInt(limit ? limit as string : '10')
                        },
                        {
                          $lookup: {
                            from: 'users',
                            localField: fieldToLookup,
                            foreignField: 'username',
                            as: lookupAs
                          }
                        },
                        {
                          $unwind: {
                            path: `$${lookupAs}`,
                            preserveNullAndEmptyArrays: true
                          }
                        },
                        {
                          $project: {
                            _id: 1,
                            username: 1,
                            createdDate: 1,
                            targetUsername: 1,
                            updatedDate: 1,
                            status: 1,
                            associatedProfilePicture: `$${lookupAs}.profilePicturePath`,
                            associatedFirstName: `$${lookupAs}.firstName`,
                            associatedLastName: `$${lookupAs}.lastName`,
                            associatedLocation: `$${lookupAs}.location`,
                            associatedFeaturedWeather: `$${lookupAs}.featuredWeather`
                          }
                        }
                      ];
                    const active_requests = await friend_requests.aggregate(active_aggregate).toArray();
                    
                    if(active_requests.length > 0){
                        res.status(200).json({
                            success: true,
                            data: active_requests
                        });
                    }else{
                        res.status(204).end();
                    }
                }catch(err){
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        error: err,
                    });
                }
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