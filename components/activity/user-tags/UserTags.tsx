import React from 'react';
import style from './user-tags.module.css';

interface UserTagsProps {

}

const UserTags: React.FC<UserTagsProps> = (props) => {
    
    return (
        <div className={style['user-tags']}>
            UserTags
        </div>
    );
};

export default UserTags;