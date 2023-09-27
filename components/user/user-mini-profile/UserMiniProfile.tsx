import React from 'react';
import style from './user-mini-profile.module.css';
import { UserInClient } from '../../../types/User';
import MiniAvatar from '../mini-avatar/MiniAvatar';

interface UserMiniProfileProps {
    user: UserInClient

}

const UserMiniProfile: React.FC<UserMiniProfileProps> = ({user}) => {
    return (
        <div className={style['user-mini-profile']}>
            <MiniAvatar 
            username={user.username} 
            profilePicturePath={user.profilePicturePath}
            size="large"
            />
            <div className={style['user-info']}>
                <div className={style['full-name']}>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>
    );
};

export default UserMiniProfile;