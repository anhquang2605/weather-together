import { NextApiResponse,NextApiRequest } from "next";
import { connectDB } from "../../../libs/mongodb";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const db = await connectDB();
    if(db){
        const { username } = req.body as { username: string };
        await db.collection("notifications").updateMany(
            { username: username },
            { $set: { read : true } }
        )
        res.status(200).json({ message: "All notifications read updated"});
    }else{
        res.status(500).json({ error: "Database error!" });
    }
}