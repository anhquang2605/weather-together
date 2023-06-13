import * as mongoDB from "mongodb";
import { connectDB } from "./mongodb";
export async function getUserIds(){//CHANGES
    try{
        let db = await connectDB() 
        if(!db) return [];
        const usersCollection: mongoDB.Collection = await db.collection('users');
        const ids : string[] = (await usersCollection.find({}, { projection: { _id: 1 } }).toArray()).map(obj => obj._id.toString());
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