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
            const {username, fetchFriends, city, filter, sort, getName} = req.query;
            const userCollection = db.collection('users');
            if(getName === 'true' && typeof username === 'string'){
                const data = await userCollection.findOne({username: username});
                if(data){
                   const firstName = data.firstName;
                   const lastName = data.lastName;
                   const name = firstName + ' ' + lastName;
                    res.status(200).json({
                        success: true,
                        data: name
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }
            }
            if(city){//fetching users by city
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
                const usersInClient:UserInClient[] = users.map((user) => pick(user, ['username', 'profilePicturePath', 'location', 'dateJoined', 'firstName', 'lastName', 'featuredWeather', 'backgroundPicturePath', 'email', 'bio']));
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
                     const user: UserInClient = pick(data, ['username', 'profilePicturePath', 'location', 'dateJoined', 'firstName', 'lastName', 'featuredWeather', 'backgroundPicturePath' , 'email', 'bio'])
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
                res.status(200).json({success: false, message: 'Bad request'});
            }
        } 
         else if (method === 'PUT') {
            const payload = req.body;
            if(payload.username && payload.featuredWeather){
                const {username, featuredWeather} = payload;
                const userCollection = db.collection('users');
                const result = await userCollection.updateOne({username: username}, {$set: {featuredWeather: 
                    {name: featuredWeather}}});
                if(result){
                    res.status(200).json({success: true, message: 'User updated'});
                }
            } else {
                res.status(200).json({success: false, message: 'Bad request'});
            }
         }
        else {
            res.status(200).json({success: false, message: 'Bad request'});
        }
    }else{
        res.status(500).json({success: false, message: 'Cannot connect to DB'});
    }
}