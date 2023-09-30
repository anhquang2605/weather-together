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
            const {username, fetchFriends, city, filter, sort} = req.query;
            const userCollection = db.collection('users');
            if(filter || sort){
                
            }//fetching users by filter
            else if(city){//fetching users by city
                const users = await userCollection.find({location: {city: city}}).toArray();
                if(!users){
                    res.status(404).json({success: false, message: 'No users found'});
                    return;
                }
                if(users.length === 0){
                    res.status(204).json(
                        {success: true, message: 'No users'}
                    );
                    return;
                }
                const usersInClient:UserInClient[] = users.map((user) => pick(user, ['username', 'profilePicturePath', 'location', 'dateJoined', 'firstName', 'lastName', 'featuredWeather', 'backgroundPicturePath', 'email']));
                res.status(200).json({
                    success: true,
                    data: usersInClient
                });
            }
            else if(fetchFriends === 'true' && username){//fetching friends
                const friendsCollection = db.collection('friends');
    
                try{
                    const friendRelationships = await friendsCollection.find({username: username}).toArray();
                    if(friendRelationships.length === 0){
                        res.status(204).json(
                            {success: true, message: 'No friends'}
                        )
                        return;
                    }
                    const friendUsernames = friendRelationships.map((relationship) => relationship.friendUsername);
                    res.status(200).json({
                        success: true,
                        data: friendUsernames
                    });
                } catch(e){
                    res.status(500).json({success: false, message: e});
                }


            }
            else if(username){//fetching a single user
               const data = await userCollection.findOne({username: username});

               if(data){
                     const user: UserInClient = pick(data, ['username', 'profilePicturePath', 'location', 'dateJoined', 'firstName', 'lastName', 'featuredWeather', 'backgroundPicturePath' , 'email'])
                    res.status(200).json({
                        success: true,
                        data: user
                    });
                }else{
                    res.status(404).json({success: false, message: 'User not found'});
                } 
            }else{
                res.status(400).json({success: false, message: 'Bad request'});
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
            } else {
                res.status(400).json({success: false, message: 'Bad request'});
            }
        } else {
            res.status(400).json({success: false, message: 'Bad request'});
        }
    }else{
        res.status(500).json({success: false, message: 'Cannot connect to DB'});
    }
}