import React from 'react';
import style from './buddy-card.module.css';
import { Buddy } from '../../../types/User';
import MiniAvatar from '../mini-avatar/MiniAvatar';
import { IoLocation } from 'react-icons/io5';
import { UserCloud } from '../../widgets/tagged-user-cloud/TaggedUserCloud';

interface BuddyCardProps {
    buddy: Buddy;
    hoverTitle?: string;
    onClickHandler: (key: UserCloud) => void;
}

const BuddyCard: React.FC<BuddyCardProps> = ({buddy, hoverTitle = '', onClickHandler}) => {
    return (
        <div onClick={()=> {
            onClickHandler({
                username: buddy.friendUsername,
                name: buddy.name,
                profilePicture: buddy.profilePicture,
            });
        }} className={style['buddy-card']} title={hoverTitle}>
            <MiniAvatar 
                username={buddy.friendUsername}
                profilePicturePath={buddy.profilePicture}
                size='large'
                featuredWeather={buddy.featuredWeather.name}
                variant="featured"
            />
            <div className={style['buddy-information']}>
                <span className={style['username']}>
                    {buddy.name === "" ? buddy.username : buddy.name}
                </span>
                <span className={style['city']}>
                    <IoLocation className="w-4 h-4"/> {buddy.city}
                </span> 
            </div>
        </div>
    );
};

export default BuddyCard;