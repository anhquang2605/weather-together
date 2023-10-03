import React from 'react';
import style from './tagged-user-list.module.css';
import { UserBasic } from '../../../../types/User';

interface TaggedUserListProps {
    users: UserBasic[];
}

const TaggedUserList: React.FC<TaggedUserListProps> = ({}) => {
    return (
        <div className={style['tagged-user-list']}>
            TaggedUserList
        </div>
    );
};

export default TaggedUserList;