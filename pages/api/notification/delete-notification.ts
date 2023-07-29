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
            let skip = parseInt(curPageNo)*parseInt(limit) - 1;
            if(skip < 0){
                res.status(200).json({newNotification: false});
            }else {
                const notification = await db.collection("notifications").find({username: username}).sort({ createdDate: -1 }).skip(skip).limit(1)
                .toArray();
    
                res.status(200).json({ notification: notification, newNotification: notification.length > 0 });
            }
            //get the one new notification
          
        } else {
            res.status(404).json({ error: "Notification not found" });
        }
    }else{
        res.status(405).json({ error: "Method not allowed" });
    }
}