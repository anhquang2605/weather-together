import {User} from "../../../types/User";

import Avatar from "../avatar/Avatar";
import BannerBackground from "../banner-background/BannerBackground";

interface ProfileBannerProps{
    user: User;
    isEditing: boolean;
    setEditingPicture?: (value: boolean) => void;
    setEditingBackground?: (value: boolean) => void;
}
export default function ProfileBanner( {user, isEditing, setEditingPicture, setEditingBackground}: ProfileBannerProps){
    
    return (
        <div className="profile-banner flex w-full px-4 pt-4 pb-[30%] rounded mb-4 relative">
            <BannerBackground setEditingBackground={setEditingBackground} bannerPicturePath={user.backgroundPicturePath ?? ""} isEditing={isEditing}/>
            <Avatar profilePicturePath={user.profilePicturePath ?? ""} setEditingPicture={setEditingPicture} isEditing={isEditing}/>
        </div>
    )
}