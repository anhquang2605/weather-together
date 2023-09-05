import React, { useEffect } from 'react';
import style from './requests-list.module.css';
import { UserInFriendRequests, UserInSearch } from '../../../../types/User';
import MiniAvatar from '../../../user/mini-avatar/MiniAvatar';
import RequestCard from './request-card/RequestCard';
import LoadingIndicator from '../../../loading-indicator/LoadingIndicator';
import { has } from 'lodash';

interface RequestsListProps {
    users: UserInFriendRequests[];
    hasMore: boolean;
    curMode: number;
    fetchMore: () => void;
    friendRequestUpdater: (index: number, fields: Partial<UserInFriendRequests>) => void;
    apiStatus: "idle" | "loading" | "success" | "error";
    isFetching: boolean;
    counts: number;
}

const RequestsList: React.FC<RequestsListProps> = ({users, curMode, hasMore, fetchMore, friendRequestUpdater, apiStatus, isFetching, counts}) => {

    const resultsJSX = users.map((user, index) => {
        return (
            <>
                <RequestCard updater={friendRequestUpdater} curMode={curMode} key={index} user={user} index={index} />
            </>
        )
    })
    const observerCallBack = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        if(entries[0].isIntersecting){
            fetchMore();
        }
    }
    useEffect(()=>{
        if(hasMore && apiStatus === "success"){
            console.log(hasMore, apiStatus)
            const option = {
                root: document.querySelector(`.${style['requests-list']}`) as HTMLDivElement,
            }
            const target = document.querySelector(`.${style['lazy-target']}`) as HTMLDivElement;
            const observer = new IntersectionObserver(observerCallBack, option);
            observer.observe(target);
            return () => {
                observer.disconnect();
            }
        }
    }, [hasMore, apiStatus])
    return (
        apiStatus === "loading" ? 
        <LoadingIndicator/> :
        <div className={style['list-container']}>
          
            <div className={style['requests-list']}> 
                    {resultsJSX}
                    <div className={`${style['lazy-target']} ${isFetching?style['fetching']:''}`}>
                        <span>Loading more...</span>
                    </div>
            </div>
            <div className={style["result-found-banner"] + " " + style[apiStatus || '']}>
                {
                    apiStatus === "error" ?
                    <span className={style['error']}>Error fetching results</span> :
                    <span className={style['result-found']}>
                        <span className={style['count-badge']}>{counts}</span> {counts > 1 ? "Requests" : "Request"}
                    </span>
                }

            </div>
        </div>
    );
};

export default RequestsList;