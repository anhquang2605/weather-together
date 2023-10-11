import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../libs/mongodb'
import { Collection, ObjectId, WithId } from 'mongodb';
import {Post} from '../../types/Post';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const db = await connectDB();
    if(db){
        const postsCollection: Collection = db.collection('posts');
        switch (method) {
            case 'GET':
                const {username, postId} = req.query;
                if(username){
                    try{
                        const post = await postsCollection.findOne({username: username});
                        if(post){
                            res.status(200).json({success: false,data:post});
                        } else {
                            res.status(404).json({ success: false, error: 'Post not found' });
                        }
                        
                    }catch(err){
                        res.status(500).json({ error: err, success: false })
                    }
                }else if(postId){

                    try{
                        const post = await postsCollection.findOne(
                            {_id: new ObjectId(postId as string)}

                        );
                        if(post){
                            res.status(200).json({
                                success: true,
                                data: post
                            });
                        }else{
                            res.status(200).json({ success: false, data: null, error: 'Post not found' });
                        }
                    }catch(err){
                        res.status(500).json({ error: err, success: false })
                    }
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