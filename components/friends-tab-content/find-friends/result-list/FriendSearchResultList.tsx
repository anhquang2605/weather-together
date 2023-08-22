import React from 'react';
import style from './friend-search-result-list.module.css';
import { UserInClient } from '../../../../types/User';
import UserSearchCard from '../../../user/user-search-card/UserSearchCard';

interface FriendSearchResultListProps {
    results: UserInClient[];
}

const FriendSearchResultList: React.FC<FriendSearchResultListProps> = ({results}) => {
    const resultJSX = () => {
        return results.map((user)=>
            <UserSearchCard key={user.username} user={user}/>
        )
    }
    return (
        <div className={style['friend-search-result-list']}>
            <h3 className={`text-xl font-semibold mb-4`}>Search Result</h3>
            <div className={style['result-list']}>
                {resultJSX()}
            </div>

        </div>
    );
};

export default FriendSearchResultList;