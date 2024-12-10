import {IoPencil} from "react-icons/io5";
import Image from "next/image";
import DefaultProfilePicture from "../default-profile-picture/DefaultProfilePicture";
import style from "./avatar.module.css";
import MiniAvatar from "../../user/mini-avatar/MiniAvatar";
import { Weather } from "../../../types/Weather";
import { useEffect, useState } from "react";
interface AvatarProps{
    profilePicturePath?: string;
    setEditingPicture?: (value: boolean) => void;
    isEditing: boolean;
    username: string | null | undefined;
    featuredWeather?: Weather;
}
const EXTRA_LARGE_BREAKPOINT = 1200;
const LARGE_BREAKPOINT = 768;
/*need to use with tailwind for styling */
export default function Avatar({profilePicturePath, setEditingPicture, isEditing, username, featuredWeather}: AvatarProps){
/*     const largeSize = '200px';
    const mediumSize = '100px';
    const smallSize = 50; */
    const [size, setSize] = useState<string>('two-x-large');
    /* xl:w-[${largeSize}] xl:h-[${largeSize}] md:w-[${mediumSize}] md:h-[${mediumSize}] sm:w-[${smallSize}] sm:h-[${smallSize}] */
    const getWindowSize = () => window.innerWidth;
    const resizeHandler = (entries: ResizeObserverEntry[]) => {
        for(const entry of entries){
            const width = entry.contentRect.width;
            if(width <= EXTRA_LARGE_BREAKPOINT){
                setSize('extra-large');
            } else {
                setSize('two-x-large');
            }
        }
    }
    useEffect(()=>{
        const window = global.window;
        if(window){
            const resizeObserver = new window.ResizeObserver(resizeHandler);
            resizeObserver.observe(window.document.body);
            return () => resizeObserver.disconnect();    
        }
    },[])
    return (
        <div className={`justify-center items-center flex flex-col z-200 relative ${style['avatar']} `}>

            <MiniAvatar 
                username={username} 
                profilePicturePath={profilePicturePath || ""}
                size={size}
                featuredWeather={featuredWeather?.name}
                variant={'featured'}
                isEditing={isEditing}
                setEditingPicture={setEditingPicture}

            />

        </div>
    )
}

