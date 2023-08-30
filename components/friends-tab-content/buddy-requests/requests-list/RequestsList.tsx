import React from 'react';
import style from './requests-list.module.css';
import { UserInFriendRequests, UserInSearch } from '../../../../types/User';
import MiniAvatar from '../../../activity/mini-avatar/MiniAvatar';
import RequestCard from './request-card/RequestCard';

interface RequestsListProps {
    users: UserInFriendRequests[];
    hasMore: boolean;
    curMode: number;
    fetchMore: () => void;
    friendRequestUpdater: (index: number, fields: Partial<UserInFriendRequests>) => void;
    apiStatus: "idle" | "loading" | "success" | "error";
}

const RequestsList: React.FC<RequestsListProps> = ({users, curMode, hasMore, fetchMore, friendRequestUpdater}) => {
    const resultsJSX = users.map((user, index) => {
        return (
            <RequestCard updater={friendRequestUpdater} curMode={curMode} key={index} user={user} index={index} />
        )
    })
    return (
        <div className={style['requests-list']}>
            {resultsJSX}
        </div>
    );
};

export default RequestsList;