import React from 'react';
import styles from './comment-list.module.css';
import { Comment } from '../../../../types/Comment';

interface CommentListProps {
    comments : Comment[];
}

const CommentList: React.FC<CommentListProps> = ({}) => {
    return (
        <div className={styles['comment-list']}>
            CommentList
        </div>
    );
};

export default CommentList;