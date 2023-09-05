import React, { useEffect } from 'react';
import style from './buddies-list.module.css';
import { Buddy } from '../../../../types/User';
import BuddyCard from './buddy-card/BuddyCard';

interface BuddiesListProps {
    buddies: Buddy[];
    hasMore: boolean;
    fetchMoreBuddies: (lastCursorDate: Date | undefined) => void;
    apiStatus: 'idle' | 'loading' | 'success' | 'error'; 
    counts: number;  
    isFetching: boolean;
    lastCursorDate: Date | undefined;
}

const BuddiesList: React.FC<BuddiesListProps> = (props) => {
    const {buddies, hasMore, fetchMoreBuddies, isFetching, apiStatus, counts, lastCursorDate} = props;
    useEffect(() => {
        if(hasMore && apiStatus === "success"){
            const option = {
                root: document.querySelector(`.${style['buddies-list']}`) as HTMLDivElement,
            }
            const target = document.querySelector(`.${style['lazy-target']}`) as HTMLDivElement;
            const observer = new IntersectionObserver((entries, observer) => {
                if(entries[0].isIntersecting){
                    fetchMoreBuddies(lastCursorDate);
                }
            }, option);
            observer.observe(target);
            return () => {
                observer.disconnect();
            }
        }
    }, [hasMore, apiStatus]);
    return (
        <div className={style['list-container']}>
            <div className={style["result-found-banner"] + " " + style[apiStatus || '']}>
                {
                    apiStatus === "error" ?
                    <span className={style['error']}>Error fetching results</span> :
                    <span className={style['result-found']}>
                        <span className={style['count-badge']}>{counts}</span> {counts > 1 ? "Buddies" : "Buddy"}
                    </span>
                }

            </div>
              <div className={style['buddies-list']}>
            {
                buddies.map( (buddy, index) => {
                    return (
                        <BuddyCard
                            key={index}
                            buddy={buddy}
                        />
                    )
                })
            }
                 <div className={`${style['lazy-target']} ${isFetching?style['fetching']:''}`}>
                    <span className="text-xl">Loading more...</span>
                </div>
            </div>
           
        </div>
      
    );
};

export default BuddiesList;