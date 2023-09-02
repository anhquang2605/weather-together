import React from 'react';
import style from './buddy-card.module.css';
import { Buddy } from '../../../../../types/User';
import MiniAvatar from '../../../../activity/mini-avatar/MiniAvatar';
import Image from 'next/image'
interface BuddyCardProps {
    buddy: Buddy;
}

const BuddyCard: React.FC<BuddyCardProps> = ({buddy}) => {
    return (
        <div className={style['buddy-card']}>

            <span className={style['background-picture']} style={{
                backgroundImage: `url(${buddy.backgroundPicture})`
            }}>
                <span className={style['overlay-screen']}>
                </span>
            </span>


            <MiniAvatar
                username={buddy.username}
                profilePicturePath={buddy.profilePicture}
                size="extra-large"
                featuredWeather={buddy.featuredWeather.name}
                variant="featured"
                className='order-first'
                hoverClassName={style['hover']}
            />
            <div className={style['buddy-info']}>
                <div className={style['title']}>
                    {buddy.name? buddy.name : buddy.username}
                </div>
            </div>
        </div>
    );
};

export default BuddyCard;