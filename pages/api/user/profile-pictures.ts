import { NextApiResponse, NextApiRequest } from "next";
import { connectDB } from "../../../libs/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method;
    const db = await connectDB();
    try{
        if(db){
            if(method === 'POST'){
                const usernames = req.body;
                const usersCollection = db.collection('users');
                const users = await usersCollection.find({username: {$in: usernames}}).toArray();
                const profilesPictureMap = new Map();
                for(let user of users){
                    profilesPictureMap.set(user.username, user.profilePicture);
                }
                if(users.length === 0){
                    res.status(200).json({
                        success: false,
                        message: "No user found"
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: profilesPictureMap
                })
            }else{
                res.status(405).json({ error: 'Method not allowed' });
            }
        }else{
            res.status(500).json({ error: 'DB connection error' });
        }
    }catch(e){
        res.status(500).json({ error: 'DB connection error'});
    }
}
