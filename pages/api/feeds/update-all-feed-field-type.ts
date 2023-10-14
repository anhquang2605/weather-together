import { NextApiRequest, NextApiResponse } from "next";
import {connectDB} from '../../../libs/mongodb';
function getRandomDate(start:string, end:string) {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const randomTimestamp = startDate + Math.random() * (endDate - startDate);
    return new Date(randomTimestamp);
}

// Usage example:

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectDB();
    if(db){
        if(req.method === 'PUT'){
            const {} = req.query;
            const collection = db.collection('feeds');
            const cursor = collection.find({ "createdDate": new Date("1970-01-01T00:00:00.000+00:00") });
            let existed = false;
            while(await  cursor.hasNext()) {
                const randomDate = getRandomDate('2023-08-21', '2023-09-10');
                const doc = await cursor.next();
                if(!doc) 
               { existed = true;
                break;}  
                await collection.updateOne({ _id: doc._id }, { $set: { createdDate: randomDate } });
            }
            if(existed){
                res.status(200).json({message:'done'});
            }
        }
    }else{

    }
   
}