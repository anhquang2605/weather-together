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
                //update the pictures with field isDeleted = true
                const reactionsCollection = db.collection('reactions');
                const match = {
                    targetId: targetId.toString(),
                }
                const result = await reactionsCollection.deleteMany(match);
                if(result.deletedCount> 0){
                   

                        //delete feeds
                        try{
                            await db.collection('feeds').deleteMany({targetId: targetId, type: 'reaction'});
                            //delete notifications
                            await db.collection('notifications').deleteMany({reference_id:  targetId, type: 'reactions'});
                        }catch(e){
                            console.log(e);
                            res.status(500).json({
                                success: false,
                                error: 'Server Error',
                            })
                            return;
                        }
                        

                    res.status(200).json({
                        success: true,
                        data: {deletedCount: result.deletedCount},
                    });
                }else{
                    res.status(200).json({
                        success: true,
                        data: {deletedCount: 0},
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

