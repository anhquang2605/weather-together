import React, { useEffect } from 'react';
import style from './friend-search-result-list.module.css';
import { UserInSearch } from '../../../../types/User';
import UserSearchCard from '../../../user/user-search-card/UserSearchCard';
import {PiSmileyBlankLight} from 'react-icons/pi';
import { IoSearch, IoSunnyOutline, IoSync } from 'react-icons/io5';
import { UserFilter, useFilter } from '../FilterContext';
import { last, set } from 'lodash';
import { init } from 'next/dist/compiled/@vercel/og/satori';

interface FriendSearchResultListProps {
    results: UserInSearch[];
    apiStatus: "idle" | "loading" | "success" | "error";
    infiniteFetcher: (filter: UserFilter, lastCursor?: Date) => void;
    lastCursor: Date | undefined;
    initiallyFetched: boolean;
    hasMore: boolean;
}

const FriendSearchResultList: React.FC<FriendSearchResultListProps> = ({results, apiStatus, infiniteFetcher, lastCursor, initiallyFetched, hasMore}) => {
    const [isFetching, setIsFetching] = React.useState(false);
    const {filter} = useFilter();
    const resultJSX = () => {
        return results.map((user,index)=>
            <UserSearchCard variant="extra-large" key={index} user={user}/>
        )
    }
    const handleObserver = (entries: IntersectionObserverEntry[], observer: IntersectionObserver, lastCursor?: Date) => {

        if (!hasMore || !initiallyFetched) return;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
               handleOnIntersected(lastCursor);
            }
        });
    }
    const handleOnIntersected = async (lastCursor?: Date) => {
        setIsFetching(true);
        try{
            console.log(lastCursor);
            await infiniteFetcher(filter, lastCursor);
        }catch(err){
            console.log(err);
        }finally{
                setIsFetching(false);
        }

    }
    useEffect(()=>{
        if(apiStatus === "success" && lastCursor){
            const optionsForObserver = {
                root: document.querySelector(`.${style['friend-search-result-list']}`), 
            };
            const observer = new IntersectionObserver((entries, observer) => handleObserver(entries,observer,lastCursor), optionsForObserver);
            const target = document.querySelector(`.${style['observer-target']}`);
            if(target){
                observer.observe(target);
            }
            return () => {
                observer.disconnect();
            }
        }
    },[apiStatus, lastCursor])
    useEffect(()=>{
        console.log(lastCursor);
    },[lastCursor]);
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
                        {isFetching && <div className={style['loading-indicator']}>
                                <IoSync className="mr-1 icon animate-spin"/>
                                <span className="flex flex-row items-center">Getting more</span>
                               
                         </div>}
                         {!hasMore && <div className={style['end-of-list']}>
                                <span className="flex flex-row items-center">Clear skies <IoSunnyOutline /> and no more folks to load!</span>
                            </div>}
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