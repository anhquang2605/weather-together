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
                } else if (!username && !postId) {
                    res.status(200).json({ success: false, error: 'Please provide username or postId' });
                }
                break;
            case 'POST':
                
                break;
            case 'PUT':
                
                break;
            case 'DELETE':
                /**
                 * Delete post steps
                 * 1. Delete all the attached pictures
                 * 2. Delete all the pictures associated with the post (post ID) is the search criteria
                 * 3. Delete all the comments and their reactions and children comments (using post ID associated with the comments)
                 * 4. Delete all the reactions and the feeds associated with the post (target ID is the post ID) need to double check
                 * 5. delete the feed associated with the post (post ID is the search criteria)
                 * 6. delete the notifications associated with the post (post ID is the search criteria)
                 * 7. delete the activities relating to the post
                 * 8. delete the post tags associated with the post and the feeds, notifications, activities
                 * 9. when all is deleted, delete the post
                 */
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