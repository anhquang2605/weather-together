import Link from "next/link";
import {User} from "../../../types/User";
import { IoPencil } from "react-icons/io5";
import Avatar from "../avatar/Avatar";
import BannerBackground from "../banner-background/BannerBackground";
import FavWeather from "../fav-weather/FavWeather";
import NameTitle from "../name-title/NameTitle";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import style from './profile-banner.module.css';
import AddBuddyBtn from "../add-buddy-btn/AddBuddyBtn";
interface ProfileBannerProps{
    user: User;
    isEditing: boolean;
    setEditingPicture?: (value: boolean) => void;
    setEditingBackground?: (value: boolean) => void;
    handleAddBuddy?: (e:React.MouseEvent) => void;
    buddyStatus?: string;
}
export default function ProfileBanner( {user, isEditing, setEditingPicture, setEditingBackground, handleAddBuddy = () => {}, buddyStatus = ""}: ProfileBannerProps){
    const {asPath} = useRouter();
    const {data:session} = useSession();
    const userFromSession = session?.user;
    const paths = asPath.split("/");
    const pathLength = paths.length;
    const usernameFromPath = paths[pathLength - 1];
    const editingProfile = pathLength > 3;
    const ownedProfile =  usernameFromPath === userFromSession?.username;
    useEffect(()=> {

    },[])
    return (
        <div className={style["profile-banner-wrapper"] + ' relative'}>
            <div className={`${style['profile-banner']} flex flex-col flex-shrink w-full px-4 pt-4 pb-[60%] md:pb-[30%]  rounded relative `}>
                <BannerBackground setEditingBackground={setEditingBackground} bannerPicturePath={user.backgroundPicturePath ?? ""} isEditing={isEditing}/>

            </div>
            <div className={style['profile-identity'] + " flex flex-row items-center justify-center" + (!isEditing && " w-full") }>
                <Avatar isPadded={true} username={user.username} featuredWeather={user.featuredWeather}  profilePicturePath={user.profilePicturePath} setEditingPicture={setEditingPicture} isEditing={isEditing}/>
                <div className="flex flex-row ml-4 grow pr-4">
                    <div className="flex flex-col justify-center">
                        <NameTitle firstName={user.firstName} lastName={user.lastName}></NameTitle>
                    </div>
                    
                    {(!editingProfile && ownedProfile) &&  <Link className="action-btn ml-4 flex flex-row items-center" href={`/userprofile/edit/${user.username}`}><IoPencil className="mr-2"></IoPencil>Edit profile</Link>}  
                    {!ownedProfile && <AddBuddyBtn handleAddBuddy={(e) => {}} status={buddyStatus} />
                    }  
                </div>
            </div>
        </div>
    )
}