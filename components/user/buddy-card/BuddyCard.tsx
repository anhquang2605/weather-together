import React, { useEffect } from 'react';
import style from './buddy-card.module.css';

import MiniAvatar from '../mini-avatar/MiniAvatar';
import { IoLocation } from 'react-icons/io5';
import { usePostFormContext } from '../../activity/post/post-engagement/usePostFormContext';
import { BuddyTag } from '../../activity/post/post-form/friend-tag-form/BuddyTagForm';

interface BuddyCardProps {
    buddy: BuddyTag;
    hoverTitle?: string;
    onClickHandler: (key: BuddyTag) => void;
}

const BuddyCard: React.FC<BuddyCardProps> = ({buddy, hoverTitle = '', onClickHandler}) => {
    const {lastItemRemoved} = usePostFormContext();
    const handleCardClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        const target = event.currentTarget as HTMLDivElement;
        target.classList.add(style['tagged']);
        onClickHandler(buddy);
    }
    useEffect(()=>{
        if(buddy.friendUsername === lastItemRemoved){
            const target = document.getElementById(buddy.friendUsername) as HTMLDivElement;
            target.classList.remove(style['tagged']);
        }
    },[lastItemRemoved])    
    return (
        <div onClick={(event)=> {
            handleCardClick(event);
           
        }} className={style['buddy-card']} id={ buddy.friendUsername}  title={hoverTitle}>
            <div className={style['buddy-wrapper'] + " "}>
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
            <div className={style["box"]}>
                
            </div>
        </div>
    );
};

export default BuddyCard;