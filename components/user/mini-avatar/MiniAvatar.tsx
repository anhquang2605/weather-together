import Image from 'next/image'
import style from './mini-avatar.module.scss';
import DefaultProfilePicture from '../../profile/default-profile-picture/DefaultProfilePicture';
import { TbCameraPlus } from "react-icons/tb";
import { useState } from 'react';
import { useUserEditProfileContext} from '../../../context/useUserEditProfileContext';
import FavWeatherWheel from '../../profile/fav-weather-wheel/FavWeatherWheel';
import { cp } from 'fs';
interface MiniAvatarProps {
    profilePicturePath: string;
    size?: string; //large, medium, small
    username: string | null | undefined;
    className?: string;
    featuredWeather?: string;
    variant?: 'basic' | 'featured' | 'mini-profile';
    isPadded?: boolean;
    hoverClassName?: string;
    hovered?: boolean;
    isEditing?: boolean;
    setEditingPicture?: (value: boolean) => void
}
export default function MiniAvatar({profilePicturePath, size = 'medium', username, className = '', featuredWeather = "", variant, hoverClassName, hovered, setEditingPicture=()=>{}, isEditing = false, isPadded = false}: MiniAvatarProps) {
    const [weather, setWeather] = useState<string>(featuredWeather);
    const [updateFeaturedWeatherStatus, setUpdateFeaturedWeatherStatus] = useState<string>('idle');
    const editProfileContext = useUserEditProfileContext();
    let contentWithContext = ( //when editing profile using the context provider
        <FavWeatherWheel weatherName={weather} isEditable={false} size={size} setFeaturedWeather={() => {} }/>
    );
    if(editProfileContext !== null){
        const {setFeaturedWeather} = editProfileContext;
        const setFeatureWeather = (theWeather: string) => {
            setUpdateFeaturedWeatherStatus('loading');
            const oldWeather = weather;
            const body = {
                username: username,
                featuredWeather: theWeather
            }
            const result = new Promise<{success: boolean}>((resolve, reject) => {
                //simulate api call that resolves with response without setTimeout
                const res = {
                    success: true
                }
                resolve(res);
            })
            //const result = updateToPutAPI('users', body)
            result.then((res) => {
                if(res.success){
                    setWeather(theWeather);
                    setFeaturedWeather(theWeather);
                    setUpdateFeaturedWeatherStatus('success');
                }else{
                    setWeather(oldWeather);
                    setFeaturedWeather(oldWeather);
                    setUpdateFeaturedWeatherStatus('error');
                }
            })
        }
        contentWithContext = (
            <FavWeatherWheel weatherName={weather} isEditable={true} size={size} setFeaturedWeather={setFeatureWeather }/>
        );
     }
    
    const dimesion = () => {
        switch(size) {
            case 'two-x-large':
                return 150;
            case 'extra-large':
                return 120;
            case 'large':
                return 100;
            case 'medium':
                return 70;
            case 'small':
                return 32;
            default:
                return 40;
        }
    }

    
    return (
        <div className={ (variant === 'featured' ? (style["outer-circle"]  + " " + style[featuredWeather || ""]) : '') + " " + (hoverClassName? hoverClassName : "" ) + " " + (hovered ? style['hovered'] : '') + " "  + (isPadded ? style['padded'] : '') + " " + (variant === 'mini-profile' ? style['mini-profile'] : '') }>
            <div className={style['mini-avatar'] + " " + style['test'] + " " + style[size] + " " + className + " "  + (isPadded ? style['padded-inner'] : '')  }>
                <div className={style['inner']}>
                    {profilePicturePath && profilePicturePath.length ? <Image alt="Mini avatar" width={dimesion()} height={dimesion()}  src={profilePicturePath}/> : <DefaultProfilePicture size={size} username={username}/>}
                </div>
            </div>

            {isEditing && setEditingPicture && 
             <>
                
                <button className="absolute top-0 left-0 transition-all w-full h-full text-transparent rounded-full p-4 font-semibold z-500 hover:hover-editable-image" onClick={()=>setEditingPicture(true)}>Update profile picture</button>
                <div className="w-full h-full rounded-full flex justify-center items-center absolute top-0 left-0 z-30">
                    <TbCameraPlus className="text-5xl text-slate-300 p-2 rounded-full bg-slate-500 bg-opacity-60"></TbCameraPlus>
                </div>
             </>
             
             }

            {
                variant === 'featured' && weather !== '' && 
                    contentWithContext
            }        </div>
    )
}
