import React, { useEffect } from 'react';
import style from './user-profile-bar.module.css';
import UserMiniProfile from '../user-mini-profile/UserMiniProfile';
import { UserWithFriendStatus } from '../../../types/User';
import UserFriendStatus from '../user-friend-status/UserFriendStatus';

interface UserProfileBarProps {
    user: UserWithFriendStatus;
    last?: boolean;
}

const UserProfileBar: React.FC<UserProfileBarProps> = (props) => {
    const [user, setUser] = React.useState<UserWithFriendStatus | null>(null);
    useEffect(()=>{
        if(props.user){
            setUser(props.user)
        }
    },[props.user])
    return (
        user ? <div className={style['user-profile-bar'] + " " + (props.last? style['last-item'] : '')}>
            <UserMiniProfile
                user={{
                    username : user.username,
                    name: user.name,
                    profilePicturePath: user.profilePicturePath,
                }}
                subInfo={user.city}
            />
            {user && <UserFriendStatus user={user} setUser={setUser}/>}
        </div> 
        : null
    );
};

export default UserProfileBar;