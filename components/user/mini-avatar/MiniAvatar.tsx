import Image from 'next/image'
import style from './mini-avatar.module.scss';
import DefaultProfilePicture from '../../profile/default-profile-picture/DefaultProfilePicture';
import { weatherToColorClassMap, weatherNameToIconAliasMap } from '../../../constants/weathers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        <div className={ (variant === 'featured' ? (style["outer-circle"]  + " " + style[featuredWeather || ""]) : '') + " " + (hoverClassName? hoverClassName : "" ) + " " + (hovered ? style['hovered'] : '')}>
            {
                variant === 'featured' && featuredWeather !== '' &&
                <div className={style['featured-weather']}>
                    <WeatherIcon
                        weatherName={featuredWeather || ''}
                        size='xl'
                    />
                </div>
            }
            <div className={style['mini-avatar'] + " " + style['test'] + " " + style[size] + " " + className }>
                <div className={style['inner']}>
                    {profilePicturePath && profilePicturePath.length ? <Image alt="Mini avatar" width={dimesion()} height={dimesion()}  src={profilePicturePath}/> : <DefaultProfilePicture username={username}/>}
                </div>
            </div>
        </div>
    )
}
