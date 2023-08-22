import React from 'react';
import style from './friend-search-result-list.module.css';
import { UserInClient } from '../../../../types/User';
import UserSearchCard from '../../../user/user-search-card/UserSearchCard';
import {PiSmileyBlankLight} from 'react-icons/pi';
import { IoSearch } from 'react-icons/io5';

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
            {
                apiStatus === "idle" &&
                <div className="w-full h-full flex flex-col justify-center align-center rounded-lg text-xl">
                    <PiSmileyBlankLight className={`w-40 h-40 mx-auto`}/>
                    <span className="flex flex-row justify-center items-center">
                        Start searching by using the search bar <IoSearch className="w-8 h-8 ml-4" />
                    </span>
                </div>
            }
            {
                apiStatus === "loading" && 
                <div className="w-full h-full bg-slate-100/20 animate-pulse flex items-center justify-center rounded-lg text-3xl font-bold">
                    <span>
                    Loading...
                    </span>

                </div>
            }
            { apiStatus === 'success' &&
                <>
                     {
                    results.length === 0 ?
                    <div className="w-full h-full rounded-lg flex justify-center items-center text-3xl">
                        No results found.
                    </div>
                    :
                    <>
                     <h3 className={`text-xl font-semibold mb-4`}>Search Result</h3>
                    <div className={style['result-list']}>
                         {resultJSX()}
                    </div>
                    </>
                }
                </>
           }
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