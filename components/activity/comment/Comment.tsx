import style from './comment.module.css'
import { Comment } from '../../../types/Comment';
import { useEffect } from 'react';
interface CommentProps{
    comment: Comment;
    profilePicturePath?: string;
}

export default function Comment(
    {
        comment
    }: CommentProps
){
    const {username, createdDate, content, updatedDate, level, _id} = comment;
    useEffect(()=>{
        const idString = _id?.toString();
    },[])
    return(
        <div className={style['comment']}>
            <div className={style['comment-title']}>
                <div className={style['comment-title__username']}>
                    {username}
                </div>

            </div>
        </div>
    )
}