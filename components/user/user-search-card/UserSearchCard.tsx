import React, { useContext } from 'react';
import style from './user-search-card.module.css';
import { UserInClient } from '../../../types/User';
import MiniAvatar from '../../activity/mini-avatar/MiniAvatar';
import FeaturedWeatherBadge from '../featured-weather-badge/FeaturedWeatherBadge';
import { useRouter } from 'next/router';
import {LiaUserFriendsSolid} from 'react-icons/lia';
import { FriendsContext } from '../../../pages/friends/FriendsContext';

interface UserSearchCardProps {
    user: UserInClient;
    variant: 'small' | 'extra-large';
}

const UserSearchCard: React.FC<UserSearchCardProps> = ({user, variant="extra-large"}) => {
    const router = useRouter();
    const {friendUsernames} = useContext(FriendsContext);
    const navigateToProfile = (username:string) => {
        router.push(`/profile/${username}`);
    }
    return (
        <div title="View Profile" onClick={()=>{
            navigateToProfile(user.username);
        }} className={`${style['user-search-card']} ${style[variant]}`}>
            <MiniAvatar
                username={user.username}
                profilePicturePath={user.profilePicturePath ?? ""}
                size={variant}
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
           
                {
                    friendUsernames.has(user.username) ?
                        <div className={`${style['buddy-badge']}`}>
                            <LiaUserFriendsSolid className={`${style['friend-icon']} icon mr-2 border border-indigo-700 rounded-full`}/> 
                            <span className={`${style['friend-title']}`}>Buddy</span>
                        </div>
                        

                    :
                    <button className={`${style.addFriendButton} action-btn`}>
                        Add friend
                    </button>
                }
        </div>
    );
};

export default UserSearchCard;