import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
import {compareSync} from "bcryptjs";
import { UserInSession } from "../../../types/User";
import { pick } from "lodash";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const {username, password} = req.body;
        const db = await connectDB();
        if(db){
            const user = await db.collection("users").findOne   ({username});
            if(user) {
                const match = compareSync(password, user.password);
                if(match) {
                    const data: UserInSession = pick(user, [
                        "username",
                        "email",
                        "firstName",
                        "lastName",
                        "featuredWeather",
                        "profilePicturePath",
                        "location"
                    ])
                    res.status(200).json({
                        type: "success",
                        success: true,
                        message: "Login successful",
                        data: data
                    })
                }else{
                    res.status(400).json({
                        type: "error",
                        message: "Incorrect password"
                    })
                }
            }else{
                res.status(400).json({
                    type: "error",
                    message: "User does not exist"
                })
            }

        }else {
            res.status(500).json({
                type: "error",
                message: "Could not connect to database"
            })
        }
        ({username}); 
       
    } else {
        res.status(400).json({
            type: "error",
            message: "Only POST requests are allowed"
        })
    }
}