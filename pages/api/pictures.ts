import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../libs/mongodb'
import { Collection, WithId } from 'mongodb';
import {Picture} from '../../types/Picture';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const db = await connectDB();
    if(db){
        const pictures: Collection<WithId<Picture>> = db.collection('pictures');
        switch (method) {
            case 'GET':
                const {targetId} = req.query;
                try {
                    let result = null;
                    if(targetId){
                        result = await pictures.find({targetId: targetId}).toArray();
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