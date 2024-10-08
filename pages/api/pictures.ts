import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../libs/mongodb'
import { Collection, WithId } from 'mongodb';
import {Picture} from '../../types/Picture';
import { insertToPostAPI } from '../../libs/api-interactions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const db = await connectDB();
    if(db){
        const picturesCollection: Collection<WithId<Picture>> = db.collection('pictures');
        switch (method) {
            case 'GET':
                const {targetId, username, many, amount, pageNo} = req.query;
                try {
                    let result = null;
                    if(targetId){
                        result = await picturesCollection.find({targetId: targetId}).toArray();
                        if(result.length > 0){
                            res.status(200).json({
                                success: true,
                                data: many === 'true' || amount ? result : result[0],
                            });
                        }else{
                            res.status(404).json({
                                success: false,
                                error: 'Not Found',
                            });
                        }
                    } else if(username){
                        if(amount){
                            const trueAmount = Number(amount);
                            const truePageNo = Number(pageNo);
                            result = await picturesCollection.find({username: username}).skip((truePageNo ? truePageNo - 1 : 0) * trueAmount).limit(trueAmount + 1).toArray();
                        } else {
                            result = await picturesCollection.find({username: username}).toArray();
                        }
                        if(result.length > 0){
                            let data = result;
                            let more = false;
                            if(amount){
                                data = result.slice(0, Number(amount));
                                more = result.length > Number(amount);
                            }
                            res.status(200).json({
                                success: true,
                                data: data,
                                more: more,
                            });
                        }else{
                            res.status(404).json({
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
                    const newPictures = pictures.map((picture:Picture) => {
                        picture.createdDate = new Date();
                        return picture;
                    });
                    try {
                        await picturesCollection.insertMany(newPictures);
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
                //delete all pictures associated with post using postId
                //NOTE: need to set up a trigger to delete all associated reactions, feeds, notifications, activities, and comments associated with the picture
                {
                    const {targetId} = req.query;
                    if(targetId ){
                        try {
                            const matches = await picturesCollection.find({targetId: targetId}).toArray();
                           
                            if(!matches){
                                res.status(404).json({
                                    success: false,
                                    error: 'Not Found',
                                });
                                return;
                            }
                            const S3URLsDeletionPath = 's3/delete-urls';
                            if(matches.length > 0){
                                const urls = matches.map((match:Picture) => match.picturePath);
                                const body = {
                                    urls
                                }
                                await insertToPostAPI(S3URLsDeletionPath, body);
                            }
                            const result = await picturesCollection.deleteMany({targetId: targetId});
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
                break;
            }
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