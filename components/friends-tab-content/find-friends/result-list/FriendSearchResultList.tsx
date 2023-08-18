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
            <h3>Search Result</h3>
            {resultJSX()}
        </div>
    );
};

export default FriendSearchResultList;