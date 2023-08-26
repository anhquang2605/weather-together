import React, { useEffect } from 'react';
import style from './friend-search-result-list.module.css';
import { UserInClient } from '../../../../types/User';
import UserSearchCard from '../../../user/user-search-card/UserSearchCard';
import {PiSmileyBlankLight} from 'react-icons/pi';
import { IoSearch } from 'react-icons/io5';
import { UserFilter, useFilter } from '../FilterContext';
import { set } from 'lodash';

interface FriendSearchResultListProps {
    results: UserInClient[];
    apiStatus: "idle" | "loading" | "success" | "error";
    infiniteFetcher: (filter: UserFilter, lastCursor?: Date) => void;
    lastCursor: Date | null;
}

const FriendSearchResultList: React.FC<FriendSearchResultListProps> = ({results, apiStatus, infiniteFetcher, lastCursor = new Date()}) => {
    const [isFetching, setIsFetching] = React.useState(false);
    const {filter} = useFilter();
    const resultJSX = () => {
        return results.map((user)=>
            <UserSearchCard variant="extra-large" key={user.username} user={user}/>
        )
    }
    const handleObserver = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                handleOnIntersected();
            }
        });
    }
    const handleOnIntersected = async () => {
        setIsFetching(true);
        try{
            await infiniteFetcher(filter, );
        }catch(err){
            console.log(err);
        }finally{
            setIsFetching(false);
        }

    }
    useEffect(() => {
        const optionsForObserver = {
            root: document.querySelector(`.${style['result-list']}`), 
        };
        const observer = new IntersectionObserver(handleObserver, optionsForObserver);
        const target = document.querySelector(`.${style['observer-target']}`);
        if(target){
            observer.observe(target);
        }
        return () => {
            observer.disconnect();
        }
    },[])
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
                    <div className={style['result-list']}>
                         {resultJSX()}
                         <div className={style['observer-target']}></div>
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