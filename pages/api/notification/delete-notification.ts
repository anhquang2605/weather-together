import { NextApiRequest,NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method === "DELETE"){
        const db = await connectDB();
        const { id, curPageNo, username, limit, referenceId, type } = req.query as { id: string, curPageNo: string, username: string, limit: string, referenceId: string, type: string };
        if (db) {  
            if(id){
                await db.collection("notifications").deleteOne(
                    { _id: new ObjectId(id), type: type },
                );
                res.status(200).json({ message: "Notification deleted"});
            } else if (referenceId){
                console.log("referenceId", referenceId);
                await db.collection("notifications").deleteMany(
                    { reference_id: referenceId },
                );
                res.status(200).json({ message: "Notifications deleted"});
            }        
            //get the one new notification
          
        } else {
            res.status(404).json({ error: "Notification not found" });
        }
    }else{
        res.status(405).json({ error: "Method not allowed" });
    }
}