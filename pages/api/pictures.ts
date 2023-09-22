import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../libs/mongodb'
import { Collection, WithId } from 'mongodb';
import {Picture} from '../../types/Picture';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const db = await connectDB();
    if(db){
        const picturesCollection: Collection<WithId<Picture>> = db.collection('pictures');
        switch (method) {
            case 'GET':
                const {targetId, username} = req.query;
                try {
                    let result = null;
                    if(targetId){
                        result = await picturesCollection.find({targetId: targetId}).toArray();
                        if(result.length > 0){
                            res.status(200).json({
                                success: true,
                                data: result[0],
                            });
                        }else{
                            res.status(204).json({
                                success: false,
                                error: 'Not Found',
                            });
                        }
                    }
                } catch (error) {
                    res.status(500).json({
                        success: false,
                        error: 'Server Error',
                    });
                }
                break;
            case 'POST':
                const pictures = req.body;
                if(pictures && pictures.length > 0){
                    try {
                        await picturesCollection.insertMany(pictures);
                        res.status(200).json({
                            success: true,
                        });
                    } catch (error) {
                        res.status(500).json({
                            success: false,
                            error: 'Server Error',
                        });
                    }
                }else {
                    res.status(400).json({
                        success: false,
                        error: 'Bad Request',
                    });
                }
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