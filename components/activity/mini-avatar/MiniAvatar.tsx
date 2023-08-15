import Image from 'next/image'
import style from './mini-avatar.module.css';
import DefaultProfilePicture from '../../profile/default-profile-picture/DefaultProfilePicture';
interface MiniAvatarProps {
    profilePicturePath: string;
    size?: string; //large, medium, small
    username: string | null | undefined;
    className?: string;
}
export default function MiniAvatar({profilePicturePath, size = 'medium', username, className = ''}: MiniAvatarProps) {
    const dimesion = () => {
        switch(size) {
            case 'extra-large':
                return 100;
            case 'large':
                return 50;
            case 'medium':
                return 40;
            case 'small':
                return 30;
            default:
                return 40;
        }
    }
    return (
        
        <div className={style['mini-avatar'] + " " + style[size] + " " + className}>
            {profilePicturePath && profilePicturePath.length ? <Image alt="Mini avatar" width={dimesion()} height={dimesion()}  src={profilePicturePath}/> : <DefaultProfilePicture username={username}/>}
        </div>
        
    )
}
