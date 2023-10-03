import React from 'react';
import style from './user-tag.module.css';
import { UserBasic } from '../../../../types/User';
import MiniAvatar from '../../../user/mini-avatar/MiniAvatar';
import { useRouter } from 'next/router';

interface UserTagProps {
    user: UserBasic;
}

const UserTag: React.FC<UserTagProps> = ({user}) => {
    const router = useRouter();
    const goToProfile = () => {
        router.push(`/userprofile/${user.username}`);
    };
    return (
        <div onClick={()=>{
            goToProfile();
        }} title={`View hub`} className={style['user-tag']}>
            <MiniAvatar
                username={user.username}
                profilePicturePath={user.profilePicturePath}
                size="small"
            />
            <div className={style['user-tag__username']}>
                {user.name ? user.name :  user.username}
            </div>
        </div>
    );
};

export default UserTag;