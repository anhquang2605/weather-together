import * as mongoDB from "mongodb";
import { connectDB } from "./mongodb";
import { User, UserInClient } from "../types/User";
import { pick } from "lodash";

export async function getUserIds(){//CHANGES
    try{
        let db = await connectDB() 
        if(!db) return [];
        const usersCollection: mongoDB.Collection = await db.collection('users');
        const ids : string[] = (await usersCollection.find({}, { projection: { username: 1 } }).toArray()).map(obj => obj._id.toString());
        //in the future, we will have a function that retrieve user ids from the database
        //id must be string
        const paths = ids.map(theid => {
            return {
                params: {
                    id: theid
                }
            }
        });
        return  paths;
    } catch(e) {
        console.log(e);
    }
    return [];
}

export async function getUserData(id: string){
    try{
        let db = await connectDB() 
        if(!db) return null;
        const usersCollection: mongoDB.Collection = await db.collection('users');
        const user = await usersCollection.findOne({ _id : new mongoDB.ObjectId(id) });
        return user;
    } catch(e) {
        console.log(e);
    }
}

export async function getUsernamePaths (){
    try{
        let db = await connectDB() 
        if(!db) return [];
        const usersCollection: mongoDB.Collection = await db.collection('users');
        const usernames : string[] = (await usersCollection.find({}, { projection: { username: 1 } }).toArray()).map(obj => obj.username);
        const paths = usernames.map(username => {
            return {
                params: {
                    username: username
                }
            }
        });
        return paths;
    } catch(e) {
        console.log(e);
    }
    return [];
}

export async function getUserDataByUserName(username: string){
    try{
       const path = '/api/users?username=' + username;
       const options = {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
       }
       const res = await fetch(path, options);
       if(res.status == 200){
           const data = await res.json();
           if(data.success){
                return data.data;
           }
       }
       return null;
    }catch(e){
        console.log(e);
        return null;
    }
}

export async function getUserDataByEmail(email: string){
    try{
        let db = await connectDB()
        if(!db) return null;
        const usersCollection: mongoDB.Collection = await db.collection('users');
        const user = await usersCollection.findOne({ email : email });
        if(!user) return null;
        return user;
    }catch(e){
        console.log(e);
    }
}

export async function checkUserData(id: string, field: string, value: any){
    try{
        let db = await connectDB() 
        if(!db) return false;
        const usersCollection: mongoDB.Collection = await db.collection('users');
        const user = await usersCollection.findOne({ _id : new mongoDB.ObjectId(id) });
        if(!user) return false;
        if(user[field] == value) return true;
        return false;
       
    } catch(e) {
        console.log(e);
    }
}

export const pickUserInClients = (users: User[]) => {
    const pickedUsers = users.map((user)=>{
        const pickedUser = pick(user, [
            'username',
            'location',
            'email',
            'featuredWeather',
            'firstName',
            'lastName',
            'profilePicturePath',
            'dateJoined',
            'backgroundPicturePath'
        ])
        return pickedUser as UserInClient;
    })
    return pickedUsers as UserInClient[];
}
export const pickUserInClient = (user: User) => {
    const pickedUser = pick(user, [
        'username',
        'location',
        'email',
        'featuredWeather',
        'firstName',
        'lastName',
        'profilePicturePath',
        'dateJoined',
        'backgroundPicturePath'
    ])
    return pickedUser as UserInClient;
}

