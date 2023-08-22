import React from 'react';
import style from './user-search-card.module.css';
import { UserInClient } from '../../../types/User';
import MiniAvatar from '../../activity/mini-avatar/MiniAvatar';
import FeaturedWeatherBadge from '../featured-weather-badge/FeaturedWeatherBadge';
import { useRouter } from 'next/router';

interface UserSearchCardProps {
    user: UserInClient
}

const UserSearchCard: React.FC<UserSearchCardProps> = ({user}) => {
    const router = useRouter();
    const navigateToProfile = (username:string) => {
        router.push(`/profile/${username}`);
    }
    return (
        <div title="View Profile" onClick={()=>{
            navigateToProfile(user.username);
        }} className={`${style['user-search-card']} glass-component`}>
            <MiniAvatar
                username={user.username}
                profilePicturePath={user.profilePicturePath ?? ""}
                size="extra-large"
            />
            <div className={`${style['information-group']}`}>
                <span className={`${style.name}`}>
                    {
                        user.firstName === '' ?
                        user.username : (user.firstName + " " + user.lastName)
                    }
                </span>
                <span className={`${style.location}`}>
                    {user.location?.city}
                </span>

                {user.featuredWeather && <span className={`${style.featuredWeather}`}>
                    <FeaturedWeatherBadge weatherName={user.featuredWeather?.name} />
                </span>}
            </div>

        </div>
    );
};

export default UserSearchCard;