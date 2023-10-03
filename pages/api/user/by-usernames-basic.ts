import {NextApiRequest, NextApiResponse} from 'next';
import {connectDB} from '../../../libs/mongodb';
import { User } from '../../../types/User';
import { WithId } from 'mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method;
    const db = await connectDB();
    if(db){
        if(method === 'POST'){
            const usernames = req.body;
            const usersCollection = db.collection<User>('users');
            const users:User[] = await usersCollection.find({username: {$in: usernames}}).toArray();
            if(users.length === 0){
                res.status(204).end();
                return;
            }
            const filteredUsers = users.map(user => {
                return{
                    username: user.username,
                    profilePicturePath: user.profilePicturePath,
                    name: user.firstName + ' ' + user.lastName,
                }
            })
            res.status(200).json({
                success: true,
                data: filteredUsers
            })
        }else{
            res.status(405).json({ error: 'Method not allowed' });
        }
    }else{
        res.status(500).json({ error: 'DB connection error' });
    }
}