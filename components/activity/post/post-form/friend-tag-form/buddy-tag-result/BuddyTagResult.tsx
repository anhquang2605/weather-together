import React, { useContext, useEffect, useState } from 'react';
import style from './buddy-tag-result.module.css';
import BuddyCard from '../../../../../user/buddy-card/BuddyCard';
import { usePostFormContext } from '../../../post-engagement/usePostFormContext';
import useLazyFetch from '../../../../../../hooks/lazy-fetch/useLazyFetch';
import { BuddyTag } from '../BuddyTagForm';
import { usePostFormContext2 } from '../../postFormContext';
interface BuddyTagResultProps {
    results: BuddyTag[];
    fetchMore: () => void;
    hasMore: boolean;
    fetchingMore: boolean;
    counts: number;
}
/*
    First detect whenever there is buddy tag added (preferably during the initial state)
    Then from here, filter out the result of the buddy tag result
*/
const BuddyTagResult: React.FC<BuddyTagResultProps> = ({results, fetchMore, hasMore, fetchingMore, counts}) => {
    const {postId} = usePostFormContext2();
    const {addTaggedUsername, getUniquePostId, taggedBuddys} = usePostFormContext();
    const [fetchState] = useLazyFetch();
    const [postUniqueId, setPostUniqueId] = useState<string>(getUniquePostId(postId));
    const [resultsState, setResultsState] = useState<BuddyTag[]>(results);
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
        const target = entries.find(entry => entry.target.id.includes(postUniqueId));
        if(target && target.isIntersecting){
            fetchMore();
        }
    }
    useEffect(()=>{
        if(hasMore && fetchState.status === 'idle'){
            const options = {
                root: document.querySelector(`#result-${postUniqueId}`) as HTMLDivElement,
            }
            const target = document.querySelector(`#lazy-target-${postUniqueId}`) as HTMLDivElement;
            const observer = new IntersectionObserver(handleIntersect, options);
            observer.observe(target);
            return () => {
                observer.disconnect();
            }
        }
    },[hasMore, fetchState.status])
    useEffect(()=>{
        if(results.length > 0){
        
            setResultsState(results);
        }
    },[results])
    const jsxResults = resultsState.map((buddy,index) => {
        return (
            <BuddyCard key={index} tagged={buddy.tagged || false} onClickHandler={addTaggedUsername} buddy={buddy} hoverTitle='Tag This Buddy'/>
        )
    })
    
    return (
        <>
            <div className={style['result-header'] + " mb-2 uppercase"}>
            
                    buddies found
            </div>   
            <div id={"result-"+postUniqueId} className={style['buddy-tag-result']}>
                <span className={"w-0 h-0 overflow-hidden flex items-center justify-center bg-slate-400 animate-pulse " + (fetchState.status === 'loading' && style['loading']) }>
                    Loading...
                </span>
                {
                (fetchingMore || fetchState.status !== 'loading')  &&
                <>
                    <div className={style['result-list']}>
                        {jsxResults}

                    </div>
                    <div id={"lazy-target-" + (postUniqueId)} className={style['lazy-target'] + " " + (fetchingMore ? style['fetching'] : '')}>
                            <span>Loading more...</span>
                    </div>
                </>}
            </div>
        </>
        
/*         <div>
            <span className={style['no-results']}>
                No buddies found 
            </span>
        </div> */
            
    );
};

export default BuddyTagResult;