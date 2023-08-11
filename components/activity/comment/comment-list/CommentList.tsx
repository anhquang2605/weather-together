import React, {useRef} from 'react';
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
    const commentListRef = useRef<HTMLDivElement| null>(null)
    const commentsJSX = comments.map((comment, index) => {
        return(
            <CommentComponent
                key={index}
                comment={comment}
                profilePicturePath={commentorToAvatarMap[comment.username]}
                commentorUsername={commentor}
                commentListRef={commentListRef}
            />
        )
    })
    return (
        <div ref={commentListRef} className={styles['comment-list']}>
            {commentsJSX}
        </div>
    );
};

export default CommentList;