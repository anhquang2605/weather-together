import {NextApiRequest, NextApiResponse} from 'next';
import {connectDB} from '../../../libs/mongodb';
import { User } from '../../../types/User';
import { WithId } from 'mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method;
    const db = await connectDB();
    if(db){
        if(method === 'POST'){
            const {username, usernames} = req.body;
            const usersCollection = db.collection<User>('users');
            const aggregation = [
                {
                    $match: {
                        username: {$in: usernames}
                    },
                },
                {
                    $lookup: {
                        from: 'friend_requests',
                        let: {username: '$username'},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            {
                                                $and: [
                                                    {$eq: ['$username', '$$username']},
                                                    {$eq: ['$targetUsername', username]}
                                                ]
                                            },
                                            {
                                                $and: [
                                                    {$eq: ['$targetUsername', '$$username']},
                                                    {$eq: ['$username', username]}
                                                ] 
                                            
                                            },
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'friend_status'
                        //set up pipeline to have a friend field that is an array that sum of user relation with other users
                    },
                },{
                    $unwind: {
                        path: '$friend_status',
                        preserveNullAndEmptyArrays: true
                    }
                },{
                    $project:{
                        username: 1,
                        profilePicturePath: 1,
                        name: {$concat: ['$firstName', ' ', '$lastName']},
                        city: '$location.city',
                        friendStatus: //return friend_status.status if it exists, else return stranger
                        {
                            $ifNull: ['$friend_status.status', 'stranger']
                        }
                    }
                }
            ]
            const users = await usersCollection.aggregate(aggregation).toArray();
            if(users.length === 0){
                res.status(204).end();
                return;
            }

            res.status(200).json({
                success: true,
                data: users
            })
        }else{
            res.status(405).json({ error: 'Method not allowed' });
        }
    }else{
        res.status(500).json({ error: 'DB connection error' });
    }
}