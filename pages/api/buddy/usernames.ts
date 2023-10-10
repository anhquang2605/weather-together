import { NextApiRequest,NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
/**
 * get list of usernames who are buddies of the user
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method;
    const db = await connectDB();
    try{
        if(db){
            if(method === 'GET'){
                const username = req.query.username as string;
                const buddiesCollection = db.collection('buddies');
                const agg = [
                    {
                        $match:{
                            username: username
                        }
                    },
                ];
                const buddies = await buddiesCollection.aggregate(agg).toArray();
                const buddiesUsernames = buddies.map(buddy => buddy.targetUsername);
                if(buddies.length === 0){
                    res.status(200).json({
                        success: false,
                        message: "No buddy found"
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: buddiesUsernames
                })
            } else {
                res.status(405).json({ error: 'Method not allowed' });
            }
        }else{
            res.status(500).json({ error: 'DB connection error' })
        }
    }catch(e){
        res.status(500).json({ error: 'DB connection error'});
    }
}