import React from 'react';
import style from './user-search-card.module.css';
import { UserInClient } from '../../../types/User';
import MiniAvatar from '../../activity/mini-avatar/MiniAvatar';

interface UserSearchCardProps {
    user: UserInClient
}

const UserSearchCard: React.FC<UserSearchCardProps> = ({user}) => {
    return (
        <div className={style['user-search-card']}>
            <MiniAvatar
                username={user.username}
                profilePicturePath={user.profilePicturePath ?? ""}
                size="large"
            />
            <span className={`${style.name}`}>
                {
                    user.firstName === '' ?
                    user.username : (user.firstName + " " + user.lastName)
                }
            </span>
            <span className={`${style.location}`}>
                {user.location?.city}
            </span>
            <span className={`${style.featuredWeather}`}>
                {user.featuredWeather?.name }
            </span>
        </div>
    );
};

export default UserSearchCard;