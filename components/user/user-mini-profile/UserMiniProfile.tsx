import React from 'react';
import style from './user-mini-profile.module.css';
import { UserInClient } from '../../../types/User';
import MiniAvatar from '../mini-avatar/MiniAvatar';
import { useRouter } from 'next/router';

interface UserMiniProfileProps {
    user: UserInClient;
    subInfo?: string;//location, date posted, etc, need to be the right properties name Ex: location.city, location.country....
    theme?: '' | 'dark'; //default is light
}

const UserMiniProfile: React.FC<UserMiniProfileProps> = ({user, subInfo, theme = ''}) => {
    const router = useRouter();
    const goToUserPage = () => {
        router.push(`/userprofile/${user.username}`);
    }
    return (
        <span title="View this user profile" onClick={()=>{
            goToUserPage();
        }} className={style['user-mini-profile']}>
            <MiniAvatar 
            username={user.username} 
            profilePicturePath={user.profilePicturePath}
            size="large"
            />
            <div className={`${style['user-info']} ${style[theme]}`}>
                <div className={style['full-name']}>
                    {user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                </div>
                {
                    subInfo && <div className={style['sub-info']}>
                        { subInfo }
                    </div>
                }
            </div>
        </span>
    );
};

export default UserMiniProfile;