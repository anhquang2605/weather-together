import {IoPencil} from "react-icons/io5";
import Image from "next/image";
interface AvatarProps{
    profilePicturePath?: string;
    setEditingPicture?: (value: boolean) => void;
    isEditing: boolean;
}
/*need to use with tailwind for styling */
export default function Avatar({profilePicturePath, setEditingPicture, isEditing}: AvatarProps){
    return (
        <div className="justify-center items-center flex flex-col max-w-md z-200 absolute bottom-0 mb-4">
             {isEditing && setEditingPicture && 
             <>
                <IoPencil className="text-3xl text-slate-300 absolute top-2 right-2"/>
                <button className="transition-all w-full h-full font-semibold absolute text-transparent top-0 left-0 hover:hover-editable-image" onClick={()=>setEditingPicture(true)}>Update profile picture</button>

             </>
             }
            <Image alt="Profile picture" width="500" height="500" className="w-16 h-16 md:w-32 md:h-32 lg:w-48 lg:h-48 object-fit:cover rounded" src={profilePicturePath ? profilePicturePath : ""}/>
            {/* Image Editting */}
           
        </div>
    )
}