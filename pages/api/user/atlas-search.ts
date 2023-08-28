import { last, pick } from "lodash";
import { connectDB } from "../../../libs/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'
import { UserInClient, UserInSearch } from "../../../types/User";
import { UserFilter } from "../../../components/friends-tab-content/find-friends/FilterContext";
interface Should{
    autocomplete?: {
        query: string,
        path: string,
        tokenOrder?: string
    },
    text?: {
        query: string,
        path: string
    }
}

interface Compound{
    compound: {
        should: Should[],
    }
}
interface FilterKeyToPath{
    [key: string]: string
}
export default async (req: NextApiRequest, res:NextApiResponse) => {
    if (req.method === 'GET') {
        const db = await connectDB();
        if(db){
            const {query, username, limit, filter, lastCursor} = req.query;
            const searchQuery = query? query as string : '';
            const usersCollection = db.collection('users');
            const fields = ['username', 'firstName', 'lastName', 'email', 'location.city', 'featuredWeather.name'];
            let lastCursorDate = null;
            let shoulds: Should[] = [];
            let compoundClauses: Compound[] = []; 
            let filterKeysNumber = 0;
            let filterKeyToPath: FilterKeyToPath = {
                'nearbyCities': 'location.city',
                'featuredWeathers': 'featuredWeather.name'
            }
            if(filter){
                filterKeysNumber = Object.keys(filter).length;
                const daFilter:UserFilter = JSON.parse(filter as string);
                for(let key in daFilter){
                    let filterValues = daFilter[key as keyof typeof daFilter];
                    let shoulds: Should[] = [];
                    if(filterValues.length > 0){
                        for(let value of filterValues){
                            shoulds.push({
                                autocomplete: {
                                    "query": value,
                                    "path": filterKeyToPath[key],
                                }
                            });
                        }
                        let compoundClause: Compound = {
                            "compound": {
                                "should": shoulds
                            }
                        }
                        compoundClauses.push(compoundClause);
                    }

                }

            }

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
                        should: shoulds,
                        must: compoundClauses
                    }
                    
                }},
                {'$match': { 
                    'username': { '$ne': username },
                    'dateJoined': { '$lt': lastCursorDate }
                }},
                { $sort: { 'dateJoined': -1 } },
                {'$limit': limit ? parseInt(limit as string) + 1 : 5},
                {
                    $lookup: {
                      from: 'friend_requests',
                      let: { username: '$username' },
                      pipeline: [
                        {
                          $match: {
                            $and: [
                              {
                                $or: [
                                  { $expr: { $eq: ['$username', '$$username'] } },
                                  { $expr: { $eq: ['$targetUsername', '$$username'] } }
                                ]
                              },
                              {
                                $or: [
                                  { username: username },
                                  { relatedUsername: username },
                                ]
                              }
                            ]
                          }
                        },
                      ],
                      as: 'friendStatus'
                    }
                  },
                  {
                    $unwind: {
                      path: '$friendStatus',
                      preserveNullAndEmptyArrays: true
                    }
                  },
                  {
                    $addFields: {
                      friendStatus: {
                        $ifNull: ['$friendStatus.status', 'stranger'],
                      }
                    }
                  }
            ];
            if( searchQuery === "" && compoundClauses.length === 0){
                agg.shift();
            }
            const results = await usersCollection.aggregate(agg).toArray(); 
            const filteredUsers: UserInSearch[] = results.map((user)=>{
                const filteredUser = pick(user, [
                    'username',
                    'location',
                    'email',
                    'featuredWeather',
                    'firstName',
                    'lastName',
                    'profilePicturePath',
                    'dateJoined',
                    'friendStatus',
                ])
                filteredUser.dateJoined = user.dateJoined.toISOString();
                return filteredUser;
            })
            const hasMore = filteredUsers.length > parseInt(limit as string);
            if(hasMore){
                filteredUsers.pop();
            }
            res.status(200).json({
                success: true,
                data: filteredUsers,
                hasMore,
            });
        }else{
            res.status(500).json({ error: 'DB connection error' });
        }
        
    } else {
        res.status(405).json({ error: 'Method not allowed' }); // Handle any other HTTP method
    }
}