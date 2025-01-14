import React from 'react';
import style from './user-mini-profile.module.css';
import { UserBasic} from '../../../types/User';
import MiniAvatar from '../mini-avatar/MiniAvatar';
import { useRouter } from 'next/router';

interface UserMiniProfileProps {
    user: UserBasic;
    subInfo?: string;//location, date posted, etc, need to be the right properties name Ex: location.city, location.country....
    theme?: '' | 'dark'; //default is light
    sizeOfAvatar?: 'small' | 'medium' | 'large';
}

const UserMiniProfile: React.FC<UserMiniProfileProps> = ({user, subInfo, theme = '', sizeOfAvatar = 'large'}) => {
    const router = useRouter();
    const goToUserPage = () => {
        router.push(`/userprofile/${user.username}`);
    }
    return (
        <span title="View this user profile" onClick={()=>{
            goToUserPage();
        }} className={style['user-mini-profile'] + " " + style[sizeOfAvatar]}>
            <MiniAvatar 
            username={user.username} 
            profilePicturePath={user.profilePicturePath}
            size={sizeOfAvatar}
            variant="mini-profile"
            />
            <div className={`${style['user-info']} ${style[theme]} $`}>
                <div className={style['full-name']}>
                    {user.name !== "" ? user.name : user.username}
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