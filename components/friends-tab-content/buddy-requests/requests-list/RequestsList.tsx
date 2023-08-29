import React from 'react';
import style from './requests-list.module.css';
import { UserInFriendRequests, UserInSearch } from '../../../../types/User';

interface RequestsListProps {
    users: UserInFriendRequests[];
}

const RequestsList: React.FC<RequestsListProps> = ({users}) => {
    const resultsJSX = users.map((user) => {
        return (
            <div key={user.username}>
                
            </div>
        )
    })
    return (
        <div className={style['requests-list']}>
            RequestsList
        </div>
    );
};

export default RequestsList;