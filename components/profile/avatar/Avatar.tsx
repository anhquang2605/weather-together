import {IoPencil} from "react-icons/io5";
import Image from "next/image";
import DefaultProfilePicture from "../default-profile-picture/DefaultProfilePicture";
import style from "./avatar.module.css";
interface AvatarProps{
    profilePicturePath?: string;
    setEditingPicture?: (value: boolean) => void;
    isEditing: boolean;
    username: string | null | undefined;
}
/*need to use with tailwind for styling */
export default function Avatar({profilePicturePath, setEditingPicture, isEditing, username}: AvatarProps){
    const largeSize = '200px';
    const mediumSize = '100px';
    const smallSize = 50;
    /* xl:w-[${largeSize}] xl:h-[${largeSize}] md:w-[${mediumSize}] md:h-[${mediumSize}] sm:w-[${smallSize}] sm:h-[${smallSize}] */

    return (
        <div className={`justify-center items-center flex flex-col z-200 relative ${style['avatar']} `}>
             {isEditing && setEditingPicture && 
             <>
                <IoPencil className="text-3xl text-slate-300 absolute top-2 right-2"/>
                <button className="transition-all w-full h-full font-semibold absolute text-transparent top-0 left-0 hover:hover-editable-image" onClick={()=>setEditingPicture(true)}>Update profile picture</button>

             </>
             }
            {profilePicturePath ? <Image alt="Profile picture" width="500" height="500" className="object-fit:cover rounded" src={profilePicturePath}/> : <DefaultProfilePicture username={username} />}
            {/* Image Editting */}
           
        </div>
    )
}