import React from 'react';
import style from './user-card.module.css';
import MiniAvatar from '../../activity/mini-avatar/MiniAvatar';
import { UserInSession } from '../../../types/User';
import {IoPersonCircle, IoLocation} from 'react-icons/io5';
interface UserCardProps {
    user: UserInSession;
    variant?: 'expanded' | 'compact';
}

const UserCard: React.FC<UserCardProps> = ({user, variant = 'expanded'}) => {
    return (
        <div className={`${style['user-card']} ${style[variant]} `}>
            <button className={`${style['user-card__card-link']}`}>
                <MiniAvatar className={style['user-card__profile-picture']} size={variant === "expanded" ?"extra-large" : "compacted-nav"} username={user.username} profilePicturePath={user.profilePicturePath ?? ""} />
                <div className={style['user-card__profile-name']}>
                {
                    user.firstName ?
                    `${user.firstName} ${variant === 'expanded' ? user.lastName : ""}`
                    :
                    user.username
                }
                </div>
              
            </button>
            {
                variant === "expanded" &&
            <> 
                <span className={`${style["card-row"]} ${style['username']}`}>
                        <IoPersonCircle className={style['icon'] + " icon"}/> <span className={style['card-row__title']}>{user.username}</span>
                </span>
                <span className={`${style["card-row"]} ${style['location']}`}>
                    <IoLocation className={style['icon'] + " icon"} /> {user.location?.city}
                </span>
            </>
            }

        </div>
    );
};

export default UserCard;