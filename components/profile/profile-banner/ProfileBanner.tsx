import {User} from "../../../types/User";

import Avatar from "../avatar/Avatar";
import BannerBackground from "../banner-background/BannerBackground";

interface ProfileBannerProps{
    user: User;
    isEditing: boolean;
    setEditingPicture: (value: boolean) => void;

}
export default function ProfileBanner( {user, isEditing, setEditingPicture}: ProfileBannerProps){
    
    return (
        <div className="profile-banner flex w-full border border-white p-4 rounded mb-4 relative">
            <BannerBackground bannerPicturePath={user.bannerPicturePath ?? ""} isEditing={isEditing}/>
            <Avatar profilePicturePath={user.profilePicturePath ?? ""} setEditingPicture={setEditingPicture} isEditing={isEditing}/>
        </div>
    )
}