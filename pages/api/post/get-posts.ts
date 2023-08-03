import { NextApiRequest,NextApiResponse } from "next/types";
import { connectDB } from "../../../libs/mongodb";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const {authorsString} = req.query;
    const authors = (authorsString as string).split(",");
    const db = await connectDB();
    const match = {
        username: {
            $in: authors
        }
    }
    if(db){
        const postsCollection = db.collection("posts");
        const posts = await postsCollection.find(match).toArray();
        if(posts && posts.length > 0){
            res.status(200).json(posts);
        }else{
            res.status(404).json({message: "No posts found"});
        }
    }else{
        res.status(500).json({message: "Cannot connect to DB"})
    }

}