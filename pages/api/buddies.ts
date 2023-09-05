import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../libs/mongodb'
import { Collection, WithId } from 'mongodb';
import {Buddy} from '../../types/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const db = await connectDB();
    if(db){
        switch (method) {
            case 'GET':
                const {username, limit, lastCursor, searchTerm} = req.query;
                const buddies = db.collection<Buddy>('buddies');
                console.log(lastCursor);
                const match:{[key: string] : any} = {
                    username: username as string,
                    since: {$lt: lastCursor ? new Date(lastCursor as string) : new Date()}
                }
                if(searchTerm && searchTerm !== ''){
                    const searchTermReg = new RegExp('.*' + searchTerm + '.*'); 
                    match.$or = [
                      {username: {$regex: searchTermReg, $options: 'i'}},
                      {name: {$regex: searchTermReg, $options: 'i'}},
                      {city: {$regex: searchTermReg, $options: 'i'}},
                      {status: {$regex: searchTermReg, $options: 'i'}},
                      {featuredWeather: {$regex: searchTermReg, $options: 'i'}},
                      {targetUsername: {$regex: searchTermReg, $options: 'i'}},
                    ];
                }
                const matchForCounts = {...match};
                delete matchForCounts.since; 
                const counts = await buddies.countDocuments(matchForCounts);
                const fetchLimit = parseInt(limit ? limit as string : '10') + 1;
                const buddiesData = await buddies.find(match).limit(fetchLimit).toArray();
                const hasMore = buddiesData.length > parseInt(limit as string);
                if(hasMore){
                    buddiesData.pop();
                }
                if(buddiesData.length > 0){
                    res.status(200).json({
                        success: true,
                        data: buddiesData,
                        hasMore: hasMore,
                        counts: counts
                    });
                }else{
                    res.status(204).end();
                }
                
                break;
            case 'POST':
               
                break;
            case 'PUT':
                
                break;
            case 'DELETE':
                
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method method Not Allowed`);
                break;
        }
    } else {
        res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    }
}