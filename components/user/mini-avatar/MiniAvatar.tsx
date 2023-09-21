import Image from 'next/image'
import style from './mini-avatar.module.scss';
import DefaultProfilePicture from '../../profile/default-profile-picture/DefaultProfilePicture';
import WeatherIcon from '../../weather-widgets/pluggins/weather-icon/WeatherIcon';
interface MiniAvatarProps {
    profilePicturePath: string;
    size?: string; //large, medium, small
    username: string | null | undefined;
    className?: string;
    featuredWeather?: string;
    variant?: 'basic' | 'featured';
    hoverClassName?: string;
    hovered?: boolean;
}
export default function MiniAvatar({profilePicturePath, size = 'medium', username, className = '', featuredWeather, variant, hoverClassName, hovered}: MiniAvatarProps) {
    const dimesion = () => {
        switch(size) {
            case 'two-x-large':
                return 150;
            case 'extra-large':
                return 100;
            case 'large':
                return 50;
            case 'medium':
                return 36;
            case 'small':
                return 32;
            default:
                return 40;
        }
    }
    const shortDimension = () => {
        switch(size){
            case 'two-x-large':
                return 'xl';
            case 'extra-large':
                return 'lg';
            case 'large':
                return 'md';
            case 'medium':
                return 'sm';
            case 'small':
                return 'sm';
            default:
                return 'md';
        }
    }
    return (
        <div className={ (variant === 'featured' ? (style["outer-circle"]  + " " + style[featuredWeather || ""]) : '') + " " + (hoverClassName? hoverClassName : "" ) + " " + (hovered ? style['hovered'] : '')}>
            {
                variant === 'featured' && featuredWeather !== '' &&
                <div className={style['featured-weather']}>
                    <WeatherIcon
                        weatherName={featuredWeather || ''}
                        size={ shortDimension()}
                    />
                </div>
            }
            <div className={style['mini-avatar'] + " " + style['test'] + " " + style[size] + " " + className }>
                <div className={style['inner']}>
                    {profilePicturePath && profilePicturePath.length ? <Image alt="Mini avatar" width={dimesion()} height={dimesion()}  src={profilePicturePath}/> : <DefaultProfilePicture size={size} username={username}/>}
                </div>
            </div>
        </div>
    )
}
