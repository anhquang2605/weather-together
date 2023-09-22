import React from 'react';
import style from './post-insertion-status-box.module.css';

interface PostInsertionStatusBoxProps {
    apiStatusAndMessageMap: Map<string, string>;
    currentApiStatus: string;// idle, loading, success, error
}

const PostInsertionStatusBox: React.FC<PostInsertionStatusBoxProps> = ({
    apiStatusAndMessageMap,
    currentApiStatus,
}) => {
    return (
        <div>
            
        </div>
    );
};

export default PostInsertionStatusBox;