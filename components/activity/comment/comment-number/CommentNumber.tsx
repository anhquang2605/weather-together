import React from 'react';
import style from './comment-number.module.css';

interface CommentNumberProps {
    count: number
}

const CommentNumber: React.FC<CommentNumberProps> = ({
    count
}) => {
    return (
        <div className={style['comment-number']}>
            {count} comments
        </div>
    );
};

export default CommentNumber;