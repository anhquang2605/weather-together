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
            res.status(200).json({ message: "Notification deleted"});
            
            //get the one new notification
          
        } else {
            res.status(404).json({ error: "Notification not found" });
        }
    }else{
        res.status(405).json({ error: "Method not allowed" });
    }
}