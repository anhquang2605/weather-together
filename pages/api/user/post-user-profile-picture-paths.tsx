import { connectDB } from "../../../libs/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
export interface usernameToProfilePicturePathMap {
    [username: string]: string;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectDB();
    const {usernames} = req.body;
    try{
        const profilePicturePaths = await db?.collection('users').find({username: {$in: usernames}}).toArray();
        let profilePictureMap = {};
        if(profilePicturePaths){
            profilePictureMap = profilePicturePaths.reduce((map:usernameToProfilePicturePathMap,user) => {
                map[user.username] = user.profilePicturePath;
                return map;
            },{})
        }
        res.status(200).json(profilePictureMap);
    } catch(e){
        res.status(500).json({message: e});
    }
   
}