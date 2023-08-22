import { pick } from "lodash";
import { connectDB } from "../../../libs/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'
import { UserInClient } from "../../../types/User";
export default async (req: NextApiRequest, res:NextApiResponse) => {
    if (req.method === 'GET') {
        const db = await connectDB();
        if(db){
            const {query, username, limit} = req.query;
            const usersCollection = db.collection('users');
            const fields = ['username', 'firstName', 'lastName', 'email', 'location.city', 'featuredWeather.name'];
            const shoulds = fields.map(field => {
                return {
                    autocomplete: {
                        query: query,
                        path: field,
                        tokenOrder: 'any',
                    }
                }
            });
            const agg = [
                {'$search': {
                    index: "autocomplete-user-search", 
                    compound:{
                        should: shoulds
                    }
                    
                }},
                {'$match': { 'username': { '$ne': username } }},
                {'$limit': limit ? parseInt(limit as string) : 5},
            ];
            const results = await usersCollection.aggregate(agg).toArray(); 
            const filteredUsers: UserInClient[] = results.map((user)=>{
                const filteredUser = pick(user, [
                    'username',
                    'location',
                    'email',
                    'featuredWeather',
                    'firstName',
                    'lastName',
                    'profilePicturePath',
                    'dateJoined'
                ])
                return filteredUser;
            })
            res.status(200).json({
                success: true,
                data: filteredUsers
            });
        }else{
            res.status(500).json({ error: 'DB connection error' });
        }
        
    } else {
        res.status(405).json({ error: 'Method not allowed' }); // Handle any other HTTP method
    }
}