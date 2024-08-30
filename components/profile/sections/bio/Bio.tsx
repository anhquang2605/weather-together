import React, { useState } from 'react'
import { IoPencil } from 'react-icons/io5';
import styles from './bio.module.css';
interface BioProps {
    userBio: string;
    isEditing: boolean;
    setEditingBio?: (value: boolean) => void;
}
export default function Bio({ userBio, isEditing, setEditingBio }: BioProps) {
    const [bio, setBio] = useState<string>(userBio);
    return (
        <div className={`${styles.bio} profile-row flex flex-col w-full relative`}>
             {isEditing && setEditingBio && <div className={` profile-section-title ${isEditing ? 'edit-title' : '' } `}>
                <h3>Bio</h3>
               
                <button onClick={()=>{setEditingBio(true)}} className="ml-auto" title="Edit">
                    <IoPencil className="text-2xl text-slate-300" />
                </button>
                
            </div>
            }
            <p className={`${isEditing ? 'is-editing-profile-title' : ''} ${styles['bio-content']} profile-section-content big-boy`}>{bio}</p>
          
        </div>
    )
}
