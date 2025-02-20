import style from "./avatar.module.css";
import MiniAvatar from "../../user/mini-avatar/MiniAvatar";
import { Weather } from "../../../types/Weather";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
interface AvatarProps{
    profilePicturePath?: string;
    setEditingPicture?: (value: boolean) => void;
    isEditing: boolean;
    username: string | null | undefined;
    featuredWeather?: Weather;
    isPadded?: boolean

}
const EXTRA_LARGE_BREAKPOINT = 1200;
const LARGE_BREAKPOINT = 768;
/*need to use with tailwind for styling */
export default function Avatar({profilePicturePath, setEditingPicture, isEditing, username, featuredWeather, isPadded}: AvatarProps){
/*     const largeSize = '200px';
    const mediumSize = '100px';
    const smallSize = 50; */
    const [size, setSize] = useState<string>('two-x-large');
    const {data: session} = useSession();
    /* xl:w-[${largeSize}] xl:h-[${largeSize}] md:w-[${mediumSize}] md:h-[${mediumSize}] sm:w-[${smallSize}] sm:h-[${smallSize}] */
    const getWindowSize = () => window.innerWidth;
    const resizeHandler = (entries: ResizeObserverEntry[]) => {
        for(const entry of entries){
            const width = entry.contentRect.width;
            if(width <= LARGE_BREAKPOINT){
                setSize('two-x-large');
            } else if (width <= EXTRA_LARGE_BREAKPOINT){
                setSize('extra-large');
            } else  {
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
        <div className={`justify-center items-center flex flex-col z-200 relative ${style['avatar']} ${isPadded? style['avatar-padded'] : ""}`}>

            <MiniAvatar 
                username={username} 
                profilePicturePath={profilePicturePath || ""}
                size={size}
                featuredWeather={featuredWeather?.name}
                variant={'featured'}
                isEditing={isEditing}
                setEditingPicture={setEditingPicture}
                isPadded={isPadded}
            />

        </div>
    )
}

