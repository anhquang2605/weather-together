interface AvatarProps{
    profilePicturePath?: string;
    setEditingPicture: (value: boolean) => void;
    isEditing: boolean;
}
/*need to use with tailwind for styling */
export default function Avatar({profilePicturePath, setEditingPicture, isEditing}: AvatarProps){
    return (
        <div className="justify-center items-center flex flex-col max-w-md z-200 relative">
            <img className="w-16 h-16 md:w-32 md:h-32 lg:w-48 lg:h-48 object-fit:cover rounded" src={profilePicturePath ? profilePicturePath : ""}></img>
            {/* Image Editting */}
            {isEditing && <button className="action-btn mt-4" onClick={()=>setEditingPicture(true)}>Update profile picture</button>}
        </div>
    )
}