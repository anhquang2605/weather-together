import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { User } from '../../../types/User';
import { useRouter } from 'next/router';
import { IoPencil } from 'react-icons/io5';
interface SummaryProps {
    user?: User;
    isEditing?: boolean;
    setEditingSummary?: (value: boolean) => void;
}
export default function Summary( {user,isEditing,setEditingSummary}: SummaryProps) {
    const {asPath, pathname} = useRouter();

    return (
        <>
          { user && <div className="w-full flex flex-col">
            {isEditing && setEditingSummary &&
            <div className="profile-section-title edit-title flex">  
                <h3 className="">Contact</h3>
                <button className="ml-auto" title="Edit" onClick={()=>{setEditingSummary(true)}}>
                    <IoPencil className="text-2xl text-slate-300" />
                </button>
            </div>
            }
            <div className={
                `${isEditing ? 'profile-section-content' : ''}`
            }>
            <div className="profile-row">
                <h4>First name</h4>
                <p>{user.firstName}</p>
            </div>
            <div className="profile-row">
                <h4>Last name</h4>
                <p>{user.lastName}</p>
            </div>
            <div className="profile-row">
                <h4>Email</h4>
                <p>{user.email}</p>
            </div>
            <div className="profile-row">
                <h4>City</h4>
                <p>{user.location?.city}</p>
            </div>
            {!isEditing&& (
                <div className="profile-row">
                    <h4>Username</h4>
                    <p>{user.username}</p>
                </div>
            )}</div>
            </div>
             }
        </>
    )    
}