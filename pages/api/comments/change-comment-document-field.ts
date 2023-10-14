import { NextApiRequest, NextApiResponse } from "next";
import {connectDB} from '../../../libs/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectDB();
    if(db){
        if(req.method === 'PUT'){
            const {} = req.query;
            //UPDATE all the documents createdDate field , if there is current Date whose type is string, convert to  Date type
            const result = await db.collection('comments').updateMany({createdDate:{$type:'string'}},{$set:{createdDate:{$toDate:'$createdDate'}}});
            res.status(200).json(result);
        
        }
    }else{

    }
   
}