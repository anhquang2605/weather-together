import {NextApiRequest, NextApiResponse} from 'next'
import { connectDB } from '../../../../libs/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'GET'){
        const {targetId} = req.query;
        if(targetId){
            const db = await connectDB();
            if(db){
                const picturesCollection = db.collection('pictures');
                const pictures = await picturesCollection.find({targetId: targetId}).toArray();
                const picturePaths = pictures.map(picture => picture.path);
                res.status(200).json({
                    success: true,
                    data: picturePaths,
                });
            }else{
                res.status(500).json({
                    success: false,
                    error: 'Server Error',
                });
            }
        }else{
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
}