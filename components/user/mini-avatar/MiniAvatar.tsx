import Image from 'next/image'
import style from './mini-avatar.module.scss';
import DefaultProfilePicture from '../../profile/default-profile-picture/DefaultProfilePicture';
import WeatherIcon from '../../weather-widgets/pluggins/weather-icon/WeatherIcon';
import { TbCameraPlus } from "react-icons/tb";
import { useState } from 'react';
import { updateToPutAPI } from '../../../libs/api-interactions';
interface MiniAvatarProps {
    profilePicturePath: string;
    size?: string; //large, medium, small
    username: string | null | undefined;
    className?: string;
    featuredWeather?: string;
    variant?: 'basic' | 'featured';
    hoverClassName?: string;
    hovered?: boolean;
    isEditing?: boolean;
    setEditingPicture?: (value: boolean) => void
}
export default function MiniAvatar({profilePicturePath, size = 'medium', username, className = '', featuredWeather = "", variant, hoverClassName, hovered, setEditingPicture=()=>{}, isEditing = false}: MiniAvatarProps) {
    const [weather, setweather] = useState<string>(featuredWeather);
    const [updateFeaturedWeatherStatus, setUpdateFeaturedWeatherStatus] = useState<string>('idle');
    const setFeatureWeather = (theWeather: string) => {
        setUpdateFeaturedWeatherStatus('loading');
        const oldWeather = weather;
        const body = {
            username: username,
            weather: theWeather
        }
        const result = updateToPutAPI('users', body)
        result.then((res) => {
            if(res.success){
                setweather(theWeather);
                setUpdateFeaturedWeatherStatus('success');
            }else{
                setweather(oldWeather);
                setUpdateFeaturedWeatherStatus('error');
            }
        })
        

    }
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
            <div className={style['mini-avatar'] + " " + style['test'] + " " + style[size] + " " + className }>
                <div className={style['inner']}>
                    {profilePicturePath && profilePicturePath.length ? <Image alt="Mini avatar" width={dimesion()} height={dimesion()}  src={profilePicturePath}/> : <DefaultProfilePicture size={size} username={username}/>}
                </div>
            </div>

            {isEditing && setEditingPicture && 
             <>
                
                <button className="absolute top-0 left-0 transition-all w-full h-full text-transparent rounded-full p-4 font-semibold z-500 hover:hover-editable-image" onClick={()=>setEditingPicture(true)}>Update profile picture</button>
                <div className="w-full h-full rounded-full flex justify-center items-center absolute top-0 left-0">
                    <TbCameraPlus className="text-3xl text-slate-300"></TbCameraPlus>
                </div>
             </>
             
             }

{
                variant === 'featured' && weather !== '' &&
                <div className={style['featured-weather']}>
                    <WeatherIcon
                        weatherName={weather || ''}
                        size={ shortDimension()}
                    />
                </div>
            }        </div>
    )
}
