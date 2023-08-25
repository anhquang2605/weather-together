import {NextApiRequest, NextApiResponse} from 'next'
import {connectDB} from '../../../libs/mongodb'
import { pickUserInClients } from '../../../libs/users';
import { User } from '../../../types/User';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method;
    const db = await connectDB();
    if(db){
        if(method === 'POST'){
            const {cities, username, limit} = req.body;
            const usersCollection = db.collection<User>('users');
            const users = await usersCollection.find({
                'location.city': {
                    $in: cities
                },
                username: {
                    $ne: username
                }
            }).limit(parseInt(limit as string)).toArray();
            const usersInClient = pickUserInClients(users);
            res.status(200).json({
                success: true,
                data: usersInClient
            })
        }else{
            res.status(405).json({ error: 'Method not allowed' });
        }
    }else{
        res.status(500).json({ error: 'DB connection error' });
    }
}