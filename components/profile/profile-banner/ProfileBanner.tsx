import {User} from "../../../types/User";

import Avatar from "../avatar/Avatar";
import BannerBackground from "../banner-background/BannerBackground";
import NameTitle from "../name-title/NameTitle";

interface ProfileBannerProps{
    user: User;
    isEditing: boolean;
    setEditingPicture?: (value: boolean) => void;
    setEditingBackground?: (value: boolean) => void;
}
export default function ProfileBanner( {user, isEditing, setEditingPicture, setEditingBackground}: ProfileBannerProps){
    
    return (
        <div className="profile-banner flex w-full px-4 pt-4 pb-[30%] rounded mb-4 relative  lg:mb-24 md:mb-16 mb-8">
            <BannerBackground setEditingBackground={setEditingBackground} bannerPicturePath={user.backgroundPicturePath ?? ""} isEditing={isEditing}/>
            <div className="absolute bottom-0  lg:-mb-24 md:-mb-16 -mb-8 flex left-4">
                <Avatar profilePicturePath={user.profilePicturePath ?? ""} setEditingPicture={setEditingPicture} isEditing={isEditing}/>
                <NameTitle firstName={user.firstName} lastName={user.lastName}></NameTitle>  
            </div>
        </div>
    )
}