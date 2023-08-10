import React from 'react';
import styles from './comment-list.module.css';
import { Comment } from '../../../../types/Comment';
import { UsernameToProfilePicturePathMap } from '../../UsernameToProfilePicturePathMap';
import CommentComponent from '../CommentComponent';
interface CommentListProps {
    comments : Comment[];
    commentorToAvatarMap: UsernameToProfilePicturePathMap;
    commentor: string;
}

const CommentList: React.FC<CommentListProps> = ({comments, commentorToAvatarMap, commentor}) => {
    const commentsJSX = comments.map((comment, index) => {
        return(
            <CommentComponent
                key={index}
                comment={comment}
                profilePicturePath={commentorToAvatarMap[comment.username]}
                commentorUsername={commentor}
            />
        )
    })
    return (
        <div className={styles['comment-list']}>
            {commentsJSX}
        </div>
    );
};

export default CommentList;