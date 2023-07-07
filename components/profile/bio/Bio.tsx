import React, { useState } from 'react'
import { IoPencil } from 'react-icons/io5';
interface BioProps {
    userBio: string;
    isEditing: boolean;
    setEditingBio?: (value: boolean) => void;
}
export default function Bio({ userBio, isEditing, setEditingBio }: BioProps) {
    const [bio, setBio] = useState<string>(userBio);
    return (
        <div className="bio flex flex-col w-full relative">

            <div className="profile-section-title flex">
                <h3 className="">About me</h3>
                {isEditing && setEditingBio && 
                <button onClick={()=>{setEditingBio(true)}} className="ml-auto" title="Edit">
                    <IoPencil className="text-2xl text-slate-300" />
                </button>
                }
            </div>

            <p className="text-slate-300 w-full text-sm bio-content min-h-[100px] ">{bio}</p>
          
        </div>
    )
}
