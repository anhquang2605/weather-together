import Image from 'next/image'
import style from './mini-avatar.module.css';
import DefaultProfilePicture from '../../profile/default-profile-picture/DefaultProfilePicture';
interface MiniAvatarProps {
    profilePicturePath: string;
    size?: string; //large, medium, small
    username: string | null | undefined;
    className?: string;
    featuredWeather?: string;
    variant?: 'basic' | 'featured';
}
export default function MiniAvatar({profilePicturePath, size = 'medium', username, className = '', featuredWeather, variant}: MiniAvatarProps) {
    const dimesion = () => {
        switch(size) {
            case 'extra-large':
                return 100;
            case 'large':
                return 50;
            case 'medium':
                return 35;
            case 'small':
                return 30;
            default:
                return 40;
        }
    }
    return (
        <div className={ variant === 'featured' ? (style["outer-circle"]  + " " + style[featuredWeather || ""]) : ''}>

            <div className={style['mini-avatar'] + " " + style['test'] + " " + style[size] + " " + className }>
                <div className={style['inner']}>
                    {profilePicturePath && profilePicturePath.length ? <Image alt="Mini avatar" width={dimesion()} height={dimesion()}  src={profilePicturePath}/> : <DefaultProfilePicture username={username}/>}
                </div>
            </div>
        </div>
    )
}
