import { NextApiRequest,NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method === "DELETE"){
        const db = await connectDB();
        const { id, curPageNo, username, limit } = req.query as { id: string, curPageNo: string, username: string, limit: string };

        if (db) {          
            await db.collection("notifications").deleteOne(
                { _id: new ObjectId(id) },
            );
            //get the one new notification
            const notification = await db.collection("notifications").find({username: username}).sort({ createdDate: -1 }).skip(parseInt(curPageNo)*parseInt(limit) - 1).limit(1)
            res.status(200).json({ notification: notification });
        } else {
            res.status(404).json({ error: "Notification not found" });
        }
    }else{
        res.status(405).json({ error: "Method not allowed" });
    }
}