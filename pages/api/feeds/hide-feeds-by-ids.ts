import {NextApiRequest, NextApiResponse} from 'next';
import {connectDB} from '../../../libs/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectDB();
    if (db) {
        if (req.method === 'PUT') {
            const {feedIds} = req.body;
            const collection = db.collection('feeds');
            const result = await collection.updateMany({_id: {$in: feedIds}}, {$set: {isDeleted: true}});
            if(result.modifiedCount > 0){
                res.status(200).json(
                    {
                        success: true,
                        data: {
                            modifleCount: result.modifiedCount
                        }
                    }
                );
            }else{
                res.status(200).json({
                    success: false,
                    data: {
                        modifleCount: 0
                    }
                })
            }
        }
    } else {

    }

}