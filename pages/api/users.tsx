import { connectDB } from "../../libs/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { UserInClient } from "../../types/User";
import { pick } from "lodash";
export interface usernameToProfilePicturePathMap {
    [username: string]: string;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectDB();
    const {method}= req;
    if(db){
        if(method === 'GET'){
            const {username} = req.query;
            const userCollection = db.collection('users');
            if(username){
               const data = await userCollection.findOne({username: username});

               if(data){
                     const user: UserInClient = pick(data, ['username', 'profilePicturePath', 'location', 'dateJoined', 'firstName', 'lastName', 'featuredWeather', 'favoriteWeathers'])
                    res.status(200).json({
                        success: true,
                        data: user
                    });
                } 
            }
        }
        else if(method === 'POST'){
            const payload = req.body;
            //geting list of profile picture paths and map each of them to its username
            if(Array.isArray(payload) && payload.length > 0){
                const usernames = payload;
                try{
                    const profilePicturePaths = await db?.collection('users').find({username: {$in: usernames}}).toArray();
                    let profilePictureMap = {};
                    if(profilePicturePaths){
                        profilePictureMap = profilePicturePaths.reduce((map:usernameToProfilePicturePathMap,user) => {
                            map[user.username] = user.profilePicturePath;
                            return map;
                        },{})
                    }
                    res.status(200).json({
                        success: true,
                        data: profilePictureMap
                    });
                } catch(e){
                    res.status(500).json({success: false, message: e});
                }
            }else if(typeof payload === 'object' && payload.username){
                //Inserting a new user
                const user = payload;
            }
        }
    }else{
        res.status(500).json({success: false, message: 'Cannot connect to DB'});
    }
}