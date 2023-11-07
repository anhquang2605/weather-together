import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from './../../../libs/mongodb';
/**
 * Delete all reactions by targetId (post, comment, picture)
 * NOTE: need to have a trigger relate to delete operation on the target collection, will delete all the feeds, notification and activies associated with the reaction (using reactionID _id)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    if(method !== 'DELETE'){
        res.status(400).json({
            success: false,
            error: 'Bad Request',
        })
        return;
    }
    try{
        const db = await connectDB();
        if(db){
            const {targetId} = req.query;
            if(targetId && typeof targetId === 'string'){
                const result = await db.collection('reactions').deleteMany({targetId: targetId});
                if(result.deletedCount > 0){
                    res.status(200).json({
                        success: true,
                        data: result.deletedCount,
                    });
                }else{
                    res.status(404).json({
                        success: false,
                        error: 'Not Found',
                    });
                }
            } else {
                res.status(400).json({
                    success: false,
                    error: 'Bad Request',
                });
            }
        }else{
            res.status(500).json({
                success: false,
                error: 'Server Error',
            });
        }
    }catch(err){
        res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    }
    

}

