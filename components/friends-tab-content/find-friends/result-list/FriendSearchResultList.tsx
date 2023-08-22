import React from 'react';
import style from './friend-search-result-list.module.css';
import { UserInClient } from '../../../../types/User';
import UserSearchCard from '../../../user/user-search-card/UserSearchCard';

interface FriendSearchResultListProps {
    results: UserInClient[];
    apiStatus: "idle" | "loading" | "success" | "error";
}

const FriendSearchResultList: React.FC<FriendSearchResultListProps> = ({results, apiStatus}) => {
    const resultJSX = () => {
        return results.map((user)=>
            <UserSearchCard variant="extra-large" key={user.username} user={user}/>
        )
    }
    return (
        <div className={style['friend-search-result-list']}>
            <h3 className={`text-xl font-semibold mb-4`}>Search Result</h3>
            {
                apiStatus === "loading" && 
                <div className="w-full h-full bg-slate-100/20 animate-pulse flex items-center justify-center rounded-lg text-3xl font-bold">
                    <span>
                    Loading...
                    </span>

                </div>
            }
            { apiStatus === 'success' && <div className={style['result-list']}>
                {resultJSX()}
            </div>}
            {
                apiStatus === "error" &&
                <div className="w-full h-full rounded-lg text-3xl">
                    Something is wrong, please try again later.
                </div>
            }
        </div>
    );
};

export default FriendSearchResultList;