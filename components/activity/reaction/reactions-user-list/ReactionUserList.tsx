import React from 'react';
import style from './reaction-user-list.module.css';

interface ReactionUserListProps {
    
}

const ReactionUserList: React.FC<ReactionUserListProps> = ({}) => {
    return (
        <div className={style['reaction-user-list']}>
            ReactionUserList
        </div>
    );
};

export default ReactionUserList;