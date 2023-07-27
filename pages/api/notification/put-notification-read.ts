import { NextApiRequest,NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method === "PUT"){
        const db = await connectDB();
        const { id, index} = req.body as { id: string, index: string };
        console.log(id, index);
        if (db) {          
            await db.collection("notifications").updateOne(
                { _id: new ObjectId(id) },
                { $set: { read: true } },
            );
            res.status(200).json({ message: "Notification read updated"});
        } else {
            res.status(404).json({ error: "Notification not found" });
        }
    }else{
        res.status(405).json({ error: "Method not allowed" });
    }
}