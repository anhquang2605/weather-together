import React from 'react';
import style from './.module.css';

interface PostModalProps {
    children: React.ReactNode;
}

const PostModal: React.FC<PostModalProps> = ({children}) => {
    
    return (
        <div className={style['']}>
            {
                children
            }
        </div>
    );
};

export default PostModal;