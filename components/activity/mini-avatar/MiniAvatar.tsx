import Image from 'next/image'
import style from './mini-avatar.module.css';
interface MiniAvatarProps {
    profilePicturePath: string;
    size?: string; //large, medium, small
}
export default function MiniAvatar({profilePicturePath, size = 'medium'}: MiniAvatarProps) {
    const dimesion = size === 'large' ? 40 : size === 'medium' ? 32 : 24;
    return (
        
        <div className={style['mini-avatar']}>
            <Image alt="Mini avatar" width={dimesion} height={dimesion}  src={profilePicturePath ? profilePicturePath : ""}/>
        </div>
        
    )
}
