import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../libs/mongodb'
import { Collection, ObjectId, WithId } from 'mongodb';
import {FriendRequest} from '../../types/FriendRequest';
import { has } from 'lodash';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const db = await connectDB();
    if(db){
        const friend_requests: Collection<FriendRequest> = db.collection('friend_requests');
        switch (method) {
            case 'GET'://get user associated with friend request
                const {username, lastCursor, limit, active, searchTerm, checkStatus, targetUsername} = req.query;
                if(checkStatus === 'true'){
                  const friendRequest = await friend_requests.findOne({username, targetUsername});
                  if(friendRequest){
                    res.status(200).json({success: true, data: friendRequest});
                  } else {
                    res.status(200).json({success: false, message: "No friend request found"});
                  }
                  return;
                } 
                const fieldToMatch = active === 'true' ? 'username' : 'targetUsername';

               /*  const fieldToLookup = active === 'true' ? 'targetUsername' : 'username';
                const lookupAs = active === 'true' ? 'senderUser' : 'receiverUser'; */
                try{
/*                     const active_aggregate = [
                        {
                          $match: {
                            [fieldToMatch]: username,
                            createdDate: {
                              $lt: lastCursor ? new Date(lastCursor as string) : new Date()
                            }
                          }
                        },
                        {
                          $limit: parseInt(limit ? limit as string : '10') + 1
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
                          $project:       
                          {
                            _id: 1,
                            username: `$${lookupAs}.username`,
                            createdDate: 1,
                            updatedDate: 1,
                            status: 1,
                            profilePicture:
                              `$${lookupAs}.profilePicturePath`,
                            city: `$${lookupAs}.location.city`,
                            backgroundPicture:
                              `$${lookupAs}.backgroundPicturePath`,
                            featuredWeather:
                              `$${lookupAs}.featuredWeather`,
                            name: {
                              $concat: [
                                `$${lookupAs}.firstName`,
                                ` `,
                                `$${lookupAs}.lastName`,
                              ],
                            },
                          },
                        }
                      ]; */
                      const viewName = active === 'true' ? 'friend_requests_receivers' : 'friend_requests_senders';
                      const view = db.collection(viewName);
                      const match: {[key: string]: any} = {
                            [fieldToMatch]: username,
                            createdDate: {
                              $lt: lastCursor ? new Date(lastCursor as string) : new Date()
                            },

                          }
                      if(searchTerm && searchTerm !== ''){
                        const searchTermReg = new RegExp('.*' + searchTerm + '.*'); 
                        match.$or = [
                          {username: {$regex: searchTermReg, $options: 'i'}},
                          {name: {$regex: searchTermReg, $options: 'i'}},
                          {city: {$regex: searchTermReg, $options: 'i'}},
                          {status: {$regex: searchTermReg, $options: 'i'}},
                          {featuredWeather: {$regex: searchTermReg, $options: 'i'}},
                          {targetUsername: {$regex: searchTermReg, $options: 'i'}},
                        ];
                      }
                    const matchForCounts = {...match};
                    delete matchForCounts.createdDate; 
                    const counts = await view.countDocuments(matchForCounts);
                    const fetchLimit = parseInt(limit ? limit as string : '10') + 1;
                    const active_requests = await view.find(match).limit(fetchLimit).toArray();
                    const hasMore = active_requests.length > parseInt(limit ? limit as string : '10');
                    if(hasMore){
                      active_requests.pop();
                    }
                    if(active_requests.length > 0){
                        res.status(200).json({
                            success: true,
                            data: active_requests,
                            hasMore: hasMore,
                            counts: counts
                        });
                    }else{
                        res.status(204).end(
                            JSON.stringify({
                                success: false,
                                message: 'No more requests',
                            })
                        );
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
                console.log(sender, receiver, status);
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