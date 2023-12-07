import React, { useEffect } from 'react';
import style from './buddy-tag-result.module.css';
import BuddyCard from '../../../../../user/buddy-card/BuddyCard';
import { usePostFormContext } from '../../../post-engagement/usePostFormContext';
import useLazyFetch from '../../../../../../hooks/lazy-fetch/useLazyFetch';
import { BuddyTag } from '../BuddyTagForm';

interface BuddyTagResultProps {
    results: BuddyTag[];
    fetchMore: () => void;
    hasMore: boolean;
    fetchingMore: boolean;
    counts: number;
}

const BuddyTagResult: React.FC<BuddyTagResultProps> = ({results, fetchMore, hasMore, fetchingMore, counts}) => {
    const {addTaggedUsername} = usePostFormContext();
    const [fetchState] = useLazyFetch();
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if(target.isIntersecting){
            fetchMore();
        }
    }
    useEffect(()=>{
        if(hasMore && fetchState.status === 'idle'){
            const options = {
                root: document.querySelector(`.${style['buddy-tag-result']}`) as HTMLDivElement,
            }
            const target = document.querySelector(`.${style['lazy-target']}`) as HTMLDivElement;
            const observer = new IntersectionObserver(handleIntersect, options);
            observer.observe(target);
            return () => {
                observer.disconnect();
            }
        }
    },[hasMore, fetchState.status])
    const jsxResults = results.map((buddy,index) => {
        return (
            <BuddyCard key={index} tagged={buddy.tagged || false} onClickHandler={addTaggedUsername} buddy={buddy} hoverTitle='Tag This Buddy'/>
        )
    })
    return (
        <>
            <div className={style['result-header'] + " mb-2 uppercase"}>
            
                    buddies found
            </div>   
            <div className={style['buddy-tag-result']}>
                <span className={"w-0 h-0 overflow-hidden flex items-center justify-center bg-slate-400 animate-pulse " + (fetchState.status === 'loading' && style['loading']) }>
                    Loading...
                </span>
                {
                (fetchingMore || fetchState.status !== 'loading')  &&
                <>
                    <div className={style['result-list']}>
                        {jsxResults}

                    </div>
                    <div className={style['lazy-target'] + " " + (fetchingMore ? style['fetching'] : '')}>
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