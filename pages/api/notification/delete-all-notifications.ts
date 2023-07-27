import { NextApiResponse,NextApiRequest } from "next";
import { connectDB } from "../../../libs/mongodb";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const db = await connectDB();
    if(db){
        const { username } = req.query as { username: string };
        await db.collection("notifications").deleteMany(
            { username: username }
        )
        res.status(200).json({ message: "All notifications delete"});
    }else{
        res.status(500).json({ error: "Database error!" });
    }
}