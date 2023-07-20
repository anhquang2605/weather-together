import { connectDB } from "../../../libs/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'
export default async (req: NextApiRequest, res:NextApiResponse) => {
    if (req.method === 'GET') {
        const db = await connectDB();
        if(db){
            const {query} = req.query;
            const usersCollection = db.collection('users');
            const agg = [
                {'$search': {
                    index: "autocomplete-tutorial", 
                    autocomplete: {
                        query: query, 
                        path: 'username' 
                    }
                }},
                {'$limit': 20},
            ];
            const results = await usersCollection.aggregate(agg) 
            if(results){
                await results.forEach((doc) => console.log(doc));

                res.status(200).json(results);
                
            }else {
                res.status(400).json({ error: 'No result' });
            }
            
        }else{
            res.status(500).json({ error: 'DB connection error' });
        }
        
    } else {
        res.status(405).json({ error: 'Method not allowed' }); // Handle any other HTTP method
    }
}