import Image from 'next/image'
import style from './mini-avatar.module.css';
import DefaultProfilePicture from '../../profile/default-profile-picture/DefaultProfilePicture';
interface MiniAvatarProps {
    profilePicturePath: string;
    size?: string; //large, medium, small
    username: string | null | undefined;
}
export default function MiniAvatar({profilePicturePath, size = 'medium', username}: MiniAvatarProps) {
    const dimesion = size === 'large' ? 40 : size === 'medium' ? 32 : 24;
    return (
        
        <div className={style['mini-avatar'] + " " + style[size]}>
            {profilePicturePath && profilePicturePath.length ? <Image alt="Mini avatar" width={dimesion} height={dimesion}  src={profilePicturePath}/> : <DefaultProfilePicture username={username}/>}
        </div>
        
    )
}
