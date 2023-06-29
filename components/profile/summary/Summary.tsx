import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { User } from '../../../types/User';
import { useRouter } from 'next/router';
interface SummaryProps {
    user?: User;
}
export default function Summary( {user}: SummaryProps) {
    const {asPath, pathname} = useRouter();

    return (
        <div>
          { user && <>
            <div>
                <p>{user.bio}</p>
            </div>
            <div className="profile-row">
                <h4>First name:</h4>
                <p>{user.firstName}</p>
            </div>
            <div className="profile-row">
                <h4>Last name:</h4>
                <p>{user.lastName}</p>
            </div>
            <div className="profile-row">
                <h4>Email:</h4>
                <p>{user.email}</p>
            </div>
            <div className="profile-row">
                <h4>City:</h4>
                <p>{user.location?.city}</p>
            </div>
            {!pathname.includes("edit") && (
                <div className="profile-row">
                    <h4>Username:</h4>
                    <p>{user.username}</p>
                </div>
            )}</> }
        </div>
    )    
}