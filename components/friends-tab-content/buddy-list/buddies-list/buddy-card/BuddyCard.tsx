import React from 'react';
import style from './buddy-card.module.css';
import { Buddy } from '../../../../../types/User';
import MiniAvatar from '../../../../activity/mini-avatar/MiniAvatar';

interface BuddyCardProps {
    buddy: Buddy;
}

const BuddyCard: React.FC<BuddyCardProps> = ({buddy}) => {
    return (
        <div className={style['buddy-card']}>
            <MiniAvatar
                username={buddy.username}
                profilePicturePath={buddy.profilePicture}
                size="extra-large"
                featuredWeather={buddy.featuredWeather.name}
            />
        </div>
    );
};

export default BuddyCard;