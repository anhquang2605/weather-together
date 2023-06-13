import * as mongoDB from "mongodb";
import { connectDB } from "./../../../libs/mongodb";
import bcrypt from 'bcrypt';
//UTILS
export async function addUser(userName: string ,password: string, email: string, location: any){
    const db = await connectDB();
    if(!db) return null;
    const usersCollection: mongoDB.Collection = await db.collection('users');
    const existingUser  = await usersCollection.findOne({userName});
    if(existingUser) return null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await usersCollection.insertOne({username: userName, password: hashedPassword, email: email, location: location});
    return user;
}

export async function getUser(userName: string ,password: string){
    const db = await connectDB();
    if(!db) return null;
    const usersCollection: mongoDB.Collection = await db.collection('users');
    const user  = await usersCollection.findOne({userName});
    if(!user) return null;
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) return null;
    return user;
}
