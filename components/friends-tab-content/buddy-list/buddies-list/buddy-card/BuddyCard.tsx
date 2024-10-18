import React from 'react';
import style from './buddy-card.module.scss';
import { Buddy } from '../../../../../types/User';
import MiniAvatar from '../../../../user/mini-avatar/MiniAvatar';
import Image from 'next/image'
import {format} from 'date-fns';
import {IoLocationSharp} from 'react-icons/io5';
import { useRouter } from 'next/router';
import Link from 'next/link';
interface BuddyCardProps {
    buddy: Buddy;
}

const BuddyCard: React.FC<BuddyCardProps> = ({buddy}) => {
    const [hovered, setHovered] = React.useState(false);
    const router = useRouter();
    const handleGoToProfile = () => {
        router.push(`/profile/${buddy.username}`);
    }
    const handleMouseEnter = () => {
        setHovered(true);
    }
    const handleMouseLeave = () => {
        setHovered(false);
    }
    return (
        <Link onMouseEnter={()=>{
            handleMouseEnter();
        }}
        onMouseLeave={()=>{
            handleMouseLeave();
        }} 
        title={'View Hub'} 
        href={`/userprofile/${buddy.friendUsername}`} className={style['buddy-card']}>

            <span className={style['background-picture']} style={{
                backgroundImage: `url(${buddy.backgroundPicture})`,
            }}>
                <span className={style['overlay-screen']}>
                </span>
            </span>

            <div className={style['profile-pic-container']}>
            <div className={style['dark-circular-shadow']}>
            </div>
                <MiniAvatar
                    username={buddy.friendUsername}
                    profilePicturePath={buddy.profilePicture}
                    size="extra-large"
                    featuredWeather={buddy.featuredWeather ? buddy.featuredWeather.name : ""}
                    variant="featured"
                    hoverClassName={style['hover']}
                    hovered={hovered}
                    isEditing={false}
                />
            </div>
            <div className={style['buddy-info']}>
                <div className={style['title']}>
                    {buddy.name? buddy.name : buddy.username}
                </div>
                <div className={style['other-info']}>
                    <span className={style['location']}>
                        <IoLocationSharp className="mr-1" /> {buddy.city}
                    </span>
                    <span className={style['since']}>
                        Buddy since {format(new Date(buddy.since), 'P')}
                    </span>
                </div>
            </div>

        </Link>
    );
};

export default BuddyCard;