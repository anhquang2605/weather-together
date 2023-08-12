import React, {useRef} from 'react';
import style from './comment-list.module.css';
import { Comment } from '../../../../types/Comment';
import { UsernameToProfilePicturePathMap } from '../../UsernameToProfilePicturePathMap';
import CommentComponent from '../CommentComponent';
import { CommentChildrenSummary } from '../../../../types/CommentChildrenSummary';
interface CommentListProps {
    comments : Comment[];
    commentorToAvatarMap: UsernameToProfilePicturePathMap;
    commentor: string;
    children: CommentChildrenSummary;
    topLevelListContainer?: React.MutableRefObject<HTMLDivElement | null>;
}

const CommentList: React.FC<CommentListProps> = ({comments, commentorToAvatarMap, commentor, children, topLevelListContainer}) => {
    const commentListRef = topLevelListContainer ?? useRef<HTMLDivElement| null>(null)
    const commentsJSX = comments.map((comment, index) => {
        return(
            <CommentComponent
                key={index}
                comment={comment}
                profilePicturePath={commentorToAvatarMap[comment.username]}
                commentorUsername={commentor}
                commentListRef={commentListRef}
                childrenNo={children[comment._id?.toString() || '']}
            />
        )
    })

    return (
        <div ref={topLevelListContainer ? null : commentListRef } className={`${style['comment-list']} ${!topLevelListContainer && style['scroll']}`}>
            {commentsJSX}
        </div>
    );
};

export default CommentList;