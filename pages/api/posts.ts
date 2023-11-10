import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, client } from '../../libs/mongodb'
import { Collection, ObjectId, WithId } from 'mongodb';
import {Post} from '../../types/Post';
import { deleteFromDeleteAPI } from '../../libs/api-interactions';
import { mongo } from 'mongoose';

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
                */
                 //1. Delete all reactions associated with the post (post ID is the search criteria) CLIENT

                 //2. Delete all the pictures associated with the post (post ID) is the search criteria CLIENT

                 //3. Delete all the comments and children comments (using post ID associated with the comments) CLIENT

                 //4. delete the feed associated with the post (post ID match with activityId of the feed is the search criteria) 

                 //5. delete the notifications associated with the post (post ID is the search criteria) SERVER

                 //6. delete the activities relating to the post SERVER

                 //7. delete the post tags associated with the post and the feeds, notifications, activities SERVER

                 //8. when all is deleted, delete the post
                {
                    const {postId, pictureAttached} = req.query;
                    if(postId && typeof postId === 'string'){
                        const post = await postsCollection.findOne({_id: new ObjectId(postId)});
                        if(!post){
                            res.status(404).json({success: false, error: 'Post not found'});
                            return;
                        }
                        const session = await client.startSession();
                        //delete all the reactions associated with the post, if there is any error, rollback
                        try {
                            await session.withTransaction(async () => {
                                //first delete all the picture associated with this post
                                const pictureDeletePath = "pictures";
                                const params = {
                                    targetId: postId
                                }
                                await deleteFromDeleteAPI(pictureDeletePath, params);
                                const reactionDeletePath = "reactions/delete-reactions-by-target";
                                const reactionParams = {
                                    targetId: postId
                                }
                                await deleteFromDeleteAPI(reactionDeletePath, reactionParams);
                                //third delete all the comments aossicate with this post
                                const commentsPath = "comments";
                                const commentsParams = {
                                    postId: postId
                                }
                                await deleteFromDeleteAPI(commentsPath, commentsParams);
                                //fourth delete the pictures attached to this post and its data on s3
                                if(pictureAttached === "true"){//need to have a trigger to delete the pictures on s3
                                    const attachedPicturesPath = "pictures";
                                    const attachedPicturesParams = {
                                        targetId: postId
                                    }
                                    await deleteFromDeleteAPI(attachedPicturesPath, attachedPicturesParams);
                                }
                                const match = {
                                    _id: new ObjectId(postId.toString()),
                                }
                                const result = await postsCollection.updateOne(match,
                                    {isDeleted: true});
                                if(result && result.modifiedCount){
                                    res.status(200).json({
                                        success: true,
                                        data: {modifiedCount: result.modifiedCount}
                                    });
                                }else{
                                    res.status(500).json({
                                        success: false,
                                        error: "Server Error",
                                    });
                                }
                            });
                        }catch(err){
                            res.status(500).json({ error: err, success: false })
                        }finally{
                            session.endSession();
                        }
                    } else {
                        res.status(400).json({success: false, error: 'Bad Request'});
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