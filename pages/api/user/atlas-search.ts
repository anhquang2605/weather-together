import { pick } from "lodash";
import { connectDB } from "../../../libs/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'
import { UserInClient } from "../../../types/User";
import { UserFilter } from "../../../components/friends-tab-content/find-friends/FilterContext";
interface Should{
    autocomplete: {
        query: string,
        path: string,
        tokenOrder: string
    }
}
export default async (req: NextApiRequest, res:NextApiResponse) => {
    if (req.method === 'GET') {
        const db = await connectDB();
        if(db){
            const {query, username, limit, filter, lastCursor} = req.query;
            const searchQuery = query? query as string : '';
            const usersCollection = db.collection('users');
            const fields = ['username', 'firstName', 'lastName', 'email', 'location.city', 'featuredWeather.name'];
            const mustConditions = [];
            let lastCursorDate = null;

            if(filter){
                const daFilter:UserFilter = JSON.parse(filter as string);
                if (daFilter.nearbyCities.length > 0) {
                    mustConditions.push({
                        "text": {
                            "query": daFilter.nearbyCities,
                            "path": "location.city"
                        }
                    });
                }
                
                if (daFilter.featuredWeathers.length > 0) {
                    mustConditions.push({
                        "text": {
                            "query": daFilter.featuredWeathers,
                            "path": "featuredWeather"
                        }
                    });
                }
            }
            let shoulds:Should[] = [];
            if(searchQuery.length > 0){
                shoulds = fields.map(field => {
                    return {
                        autocomplete: {
                            query: searchQuery,
                            path: field,
                            tokenOrder: 'any',
                        }
                    }
                });
            }

            if(lastCursor){
                lastCursorDate = new Date(lastCursor as string);
            }else{
                lastCursorDate = new Date();
            }
            const agg = [
                {'$search': {
                    index: "autocomplete-user-search", 
                    compound:{
                        must: mustConditions,
                        should: shoulds
                    }
                    
                }},
                {'$match': { 
                    'username': { '$ne': username },
                    'dateJoined': { '$lt': lastCursorDate }
                }},
                { $sort: { 'dateJoined': -1 } },
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