import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../libs/mongodb'
import { Collection, WithId } from 'mongodb';
import {Picture} from '../../../types/Picture';
import { insertToPostAPI } from '../../../libs/api-interactions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectDB();
    if(db){
        const picturesCollection: Collection<WithId<Picture>> = db.collection('pictures');
        if(req.method === 'POST'){
            //upstream problem with image url, investigate later
            const {targetIds} = req.body;
            console.log(targetIds, targetIds[0])
            if(targetIds && targetIds.length > 0){
                try {
                    const matches = await picturesCollection.find({targetId: {$in: targetIds}}).toArray();
                    console.log(matches);
                    const urls = matches.map((match:Picture) => match.picturePath);
                    if(urls.length > 0){
                        const S3URLsDeletionPath = 's3/delete-urls';
                        const body = {
                            urls: urls
                        }
                        await insertToPostAPI(S3URLsDeletionPath, body);
                        const result = await picturesCollection.deleteMany({targetId: {$in: targetIds}});
                        if(result.deletedCount > 0){
                            res.status(200).json({
                                success: true,
                                data: {deletedCount: result.deletedCount}
                            });
                        }else{
                            res.status(200).json({
                                success: true,
                                data: {deletedCount: 0}
                            });
                        }
                    }else{
                        res.status(200).json({
                            success: true,
                            data: {deletedCount: 0}
                        });
                    }
                    
                } catch (error) {
                    res.status(500).json({
                        success: false,
                        error: 'Server Error',
                    });
                }
            } else {
                res.status(400).json({
                    success: false,
                    error: 'Bad Request',
                });
            }
        }else{
            res.status(400).json({
                success: false,
                error: 'Bad Request',
            });
        }
    } else {
        res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    }
}