import React from 'react';
import style from './requests-list.module.css';
import { UserInFriendRequests, UserInSearch } from '../../../../types/User';
import MiniAvatar from '../../../activity/mini-avatar/MiniAvatar';

interface RequestsListProps {
    users: UserInFriendRequests[];
    hasMore: boolean;
}

const RequestsList: React.FC<RequestsListProps> = ({users}) => {
    const resultsJSX = users.map((user) => {
        return (
            <div key={user.username}>
                <MiniAvatar 
                    username={user.username}
                    profilePicturePath={user.associatedProfilePicture}
                    size= "large"
                />
                <div className={style['username']}>
                    {user.username}
                </div>
            </div>
        )
    })
    return (
        <div className={style['requests-list']}>
            {resultsJSX}
        </div>
    );
};

export default RequestsList;