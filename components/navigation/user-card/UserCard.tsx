import React from 'react';
import style from './user-card.module.css';
import MiniAvatar from '../../activity/mini-avatar/MiniAvatar';
import { UserInSession } from '../../../types/User';

interface UserCardProps {
    user: UserInSession;
    variant?: 'expanded' | 'compact';
}

const UserCard: React.FC<UserCardProps> = ({user, variant = 'expanded'}) => {
    return (
        <div className={style['user-card']}>
            <MiniAvatar className={style['user-card__profile-picture']} size="large" username={user.username} profilePicturePath={user.profilePicturePath ?? ""} />
           {<div className={style['user-card__name']}>{user.name}</div>}
            <div className={style['user-card__username']}>{user.username}</div>

        </div>
    );
};

export default UserCard;