import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { User } from '../../../types/User';
import { useRouter } from 'next/router';
interface SummaryProps {
    user?: User;
}
export default function Summary( props: SummaryProps) {
    const user = useSelector((state: any) => state.user);
    const {asPath, pathname} = useRouter();

    return (
        <div>
            <div className="profile-row">
                <h4>First name:</h4>
                <p>{user.data.firstName}</p>
            </div>
            <div className="profile-row">
                <h4>Last name:</h4>
                <p>{user.data.lastName}</p>
            </div>
            <div className="profile-row">
                <h4>Email:</h4>
                <p>{user.data.email}</p>
            </div>
            <div className="profile-row">
                <h4>City:</h4>
                <p>{user.data.location.city}</p>
            </div>
            {!pathname.includes("edit") && (
                <div className="profile-row">
                    <h4>Username:</h4>
                    <p>{user.data.username}</p>
                </div>
            )}
        </div>
    )    
}