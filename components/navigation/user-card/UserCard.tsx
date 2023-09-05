import React from 'react';
import style from './user-card.module.css';
import MiniAvatar from '../../user/mini-avatar/MiniAvatar';
import { UserInSession } from '../../../types/User';
import {IoPersonCircle, IoLocation} from 'react-icons/io5';
import Link from 'next/link'
interface UserCardProps {
    user: UserInSession;
    variant?: 'expanded' | 'compact';
}

const UserCard: React.FC<UserCardProps> = ({user, variant = 'expanded'}) => {
    return (
        <div className={`${style['user-card']} ${style[variant]} `}>
            <Link title={"Go to my profile"} href={`userprofile/${user.username}`} className={`${style['user-card__card-link']}`}>
                <MiniAvatar className={style['user-card__profile-picture']} size={variant === "expanded" ?"large" : "compacted-nav"} username={user.username} profilePicturePath={user.profilePicturePath ?? ""} />
              
                {
                variant === "expanded" &&
                    <div className={style['information']}>
                        <div className={style['user-card__profile-name']}>
                            {
                                user.firstName ?
                                `${user.firstName} ${variant === 'expanded' ? user.lastName : ""}`
                                :
                                user.username
                            }
                        </div> 
                        <span className={`${style["card-row"]} ${style['location']}`}>
                            <IoLocation className={style['icon'] + " icon"} /> {user.location?.city}
                        </span>
                    </div>
                }
            </Link>


        </div>
    );
};

export default UserCard;