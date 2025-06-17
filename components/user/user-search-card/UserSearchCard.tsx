import React, {useState } from 'react';
import style from './user-search-card.module.css';
import { UserInSearch } from '../../../types/User';
import MiniAvatar from '../mini-avatar/MiniAvatar';
import FeaturedWeatherBadge from '../featured-weather-badge/FeaturedWeatherBadge';
import { useRouter } from 'next/router';
import {LiaUserFriendsSolid} from 'react-icons/lia';
import { RiPassPendingLine } from 'react-icons/ri';
import { useSession } from 'next-auth/react';

interface UserSearchCardProps {
    user: UserInSearch;
    variant: 'small' | 'extra-large';
}

const UserSearchCard: React.FC<UserSearchCardProps> = ({user, variant="extra-large"}) => {
    const router = useRouter();
    const {data: session} = useSession();
    const account_user = session?.user;
    const [cardUser, setCardUser] = useState<UserInSearch>(user);
    const navigateToProfile = (username:string) => {
        router.push(`/userprofile/${username}`);
    }
    const buddyStatusRenderer = (status:string) => {
        switch(status){
            case 'accepted':
                return  <div className={`${style['buddy-badge']}`}>
                            <LiaUserFriendsSolid className={`${style['friend-icon']} icon mr-2 border border-indigo-700 rounded-full`}/> 
                            <span className={`${style['friend-title']}`}>Buddy</span>
                        </div>
            case 'pending':
                return  <div className={`${style['buddy-badge']}`}>
                            <RiPassPendingLine className={`${style['friend-icon']} icon mr-2`}/>
                            <span className={`${style['friend-title']}`}>Pending...</span>
                        </div>
            default:
                return <button title="" onClick={(e) => handleAddBuddy(e)} className={`${style.addFriendButton} action-btn`}>
                            Add buddy
                        </button>
        }
    }
    const handleAddBuddy = async (e:React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCardUser({...cardUser, friendStatus: 'pending'});
        const sender = account_user?.username;
        const receiver = user.username;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sender, receiver})
        }
        try {
            await fetch('/api/friend-requests', options);
        } catch (error) {
           setCardUser({...cardUser, friendStatus: 'stranger'});
        }
        

    }
    return (
        <div title="View Profile" onClick={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            navigateToProfile(cardUser.username);
        }} className={`${style['user-search-card']} ${style[variant]}`}>
            <MiniAvatar
                username={cardUser.username}
                profilePicturePath={cardUser.profilePicturePath ?? ""}
                size={variant}
            />
            <div className={`${style['information-group']}`}>
                <span className={`${style.name}`}>
                    {
                        cardUser.firstName === '' ?
                        cardUser.username : (cardUser.firstName + " " + cardUser.lastName)
                    }
                </span>
                <span className={`${style.location}`}>
                    {cardUser.location?.city}
                </span>

                {cardUser.featuredWeather && <span className={`${style.featuredWeather}`}>
                    <FeaturedWeatherBadge weatherName={cardUser.featuredWeather?.name} />
                </span>}
            </div>
           
                {
                   buddyStatusRenderer(cardUser.friendStatus)
                }
        </div>
    );
};

export default UserSearchCard;