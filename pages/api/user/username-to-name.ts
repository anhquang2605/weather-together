import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
interface stringMap{
    [key: string]: string;
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    try{
        if(req.method !== "POST"){
            return res.status(405).json({ statusCode: 405, message: "Method not allowed" });
        }
        const db = await connectDB();
        if(db){
            const usernames = req.body;
            const user = await db.collection("users").find({ username: { $in: usernames } }).toArray();
            const usernamesToNameMap = user.reduce((acc:stringMap, cur) => {
                acc[cur.username] = cur.firstName + " " + cur.lastName;
                return acc;
            }, {});
            if(user){
                res.status(200).json({ success: true, data: usernamesToNameMap });
            }else{
                res.status(200).json({
                    success: false,
                    message: "No user found"
                
                })
            }
        }else{
            res.status(500).json({ statusCode: 500, message: "Database error, cannot connect" });
        }
       
    }catch(error){
        res.status(500).json({ statusCode: 500, message: error });
    }
   
}