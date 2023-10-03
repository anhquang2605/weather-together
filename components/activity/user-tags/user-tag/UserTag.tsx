import React from 'react';
import style from './user-tag.module.css';
import { UserInClient } from '../../../../types/User';
import MiniAvatar from '../../../user/mini-avatar/MiniAvatar';

interface UserTagProps {
    user: UserInClient;
}

const UserTag: React.FC<UserTagProps> = ({user}) => {
    return (
        <div className={style['user-tag']}>
            <MiniAvatar
                username={user.username}
                profilePicturePath={user.profilePicturePath}
                size="small"
            />
            <div className={style['user-tag__username']}>
                {user.firstName || user.lastName ? user.firstName + " " + user.lastName :  user.username}
            </div>
        </div>
    );
};

export default UserTag;