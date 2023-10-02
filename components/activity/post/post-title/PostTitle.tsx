import { formatDistance } from "date-fns";
import { WeatherVibe } from "../../../../types/Post";
import WeatherVibeComponent from "../weather-vibe-component/WeatherVibeComponent";
import style from "./post-title.module.css"
import {MdPublic, MdPeople, MdLock} from 'react-icons/md'
import Image from 'next/image'
import MiniAvatar from "../../../user/mini-avatar/MiniAvatar";
interface PostTitleProps{
    username: string;
    profilePicturePath: string;
    weatherVibe?: WeatherVibe; 
    createdDate: Date;
    visibility: string;
}
const visibilityIcons:any ={
    "public": <MdPublic className="icon" />,
    "friends": <MdPeople className="icon"  />,
    "private":  <MdLock className="icon"  /> ,
}
export default function PostTitle(
    {
        username, 
        profilePicturePath, 
        weatherVibe,
        createdDate,
        visibility
    }: PostTitleProps
)
{
    return(
        <div className={style['post-title']}>
            <div className={style['post-title__profile-picture']}>
               <MiniAvatar 
                    username={username}
                    profilePicturePath={profilePicturePath}
                    size="large"
               />
            </div>
            <div className="flex-grow">
                <div className={style['title-top']}>
                    <div className={style['post-title__username']}>
                        {username}
                    </div>
                    {weatherVibe &&
                        <WeatherVibeComponent weatherVibe={weatherVibe}/>
                    }
                </div>
                <div className={style['title-bottom']}>
                    <span className={style['post-title__timestamp']}>
                        {formatDistance(new Date(createdDate), new Date(), { addSuffix: true })}
                    </span>
                    <span className={style['post-title__visibility']}>
                        {visibilityIcons[visibility]}
                    </span>
                </div>
            </div>

            
           
            

        </div>
    )
}