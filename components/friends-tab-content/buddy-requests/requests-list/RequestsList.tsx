import React from 'react';
import style from './requests-list.module.css';
import { UserInFriendRequests, UserInSearch } from '../../../../types/User';
import MiniAvatar from '../../../activity/mini-avatar/MiniAvatar';
import RequestCard from './request-card/RequestCard';
import LoadingIndicator from '../../../loading-indicator/LoadingIndicator';

interface RequestsListProps {
    users: UserInFriendRequests[];
    hasMore: boolean;
    curMode: number;
    fetchMore: () => void;
    friendRequestUpdater: (index: number, fields: Partial<UserInFriendRequests>) => void;
    apiStatus: "idle" | "loading" | "success" | "error";
}

const RequestsList: React.FC<RequestsListProps> = ({users, curMode, hasMore, fetchMore, friendRequestUpdater, apiStatus}) => {
    const resultsJSX = users.map((user, index) => {
        return (
            <RequestCard updater={friendRequestUpdater} curMode={curMode} key={index} user={user} index={index} />
        )
    })
    return (
        apiStatus === "loading" ? 
        <LoadingIndicator/> :
        <div className={style['requests-list']}>
            {resultsJSX}
            <div className={style["extra"]}>

            </div>
        </div>
    );
};

export default RequestsList;