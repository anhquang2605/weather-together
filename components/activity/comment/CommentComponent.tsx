import style from './comment-component.module.css'
import { Comment } from '../../../types/Comment';
import MiniAvatar from '../mini-avatar/MiniAvatar';
import { formatDistance } from 'date-fns';
import {useEffect, useState} from 'react';
import InteractionsBtns from '../interactions-btns/InteractionsBtns';
import CommentForm from './comment-form/CommentForm';
import { is } from 'date-fns/locale';
interface CommentComponentProps{
    comment: Comment;
    profilePicturePath: string;
    commentorUsername: string;
    commentListRef: React.MutableRefObject<HTMLDivElement | null>;
}

export default function CommentComponent(
    {
        comment,
        profilePicturePath,
        commentorUsername,
        commentListRef
    }: CommentComponentProps
){
    const {username, createdDate, content, postId, updatedDate, level, _id} = comment;
    const [isReplying, setIsReplying] = useState(false);

    return(
        <div className={`${style['comment-component']} ${level > 0 ? style['child-comment'] : ''}`}>
            <MiniAvatar profilePicturePath={profilePicturePath} />
            <div className={style['content-group']}>
                <div className={style['content-group__username']}>
                    {username}
                </div>
                <div className={style['content-group__content']}>
                    {content}
                </div>
                <div className={style['content-group__control-and-date']}>
                    <InteractionsBtns 
                        targetId={_id?.toString() || ''}
                        username={commentorUsername}
                        variant="shrinked"
                        handleCommentBtnClick={()=>{
                            setIsReplying(prev => !prev);
                        }}
                    />    
                    <div className={style['content-group__created-date']}>
                        {formatDistance(new Date(createdDate), new Date(), {addSuffix: true})}
                    </div>  
                </div> 
                <CommentForm 
                    targetId={_id?.toString() || ''} 
                    username={commentorUsername} 
                    postId={postId} 
                    isCommenting={isReplying} 
                    setIsCommenting={setIsReplying} 
                    userProfilePicturePath={profilePicturePath} 
                    targetType='comments' 
                    targetLevel={level}
                    parentListRef={commentListRef}
                    />    
            </div>  
        </div>
    )
}