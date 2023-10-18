import React, { use, useEffect, useState } from 'react';
import style from './feed-list.module.css';
import { useFeedContext } from '../FeedsContext';
import { Feed, FeedGroup } from '../../../../types/Feed';
import FeedComponent from '../feed-component/FeedComponent';
import { set } from 'lodash';
import FeedGroupComponent from '../feed-group-component/FeedGroupComponent';
import LoadingIndicator from '../../../loading-indicator/LoadingIndicator';

interface FeedListProps {
    feedGroups: FeedGroup[];
    setIsEndOfList: React.Dispatch<React.SetStateAction<boolean>>;
}

const FeedList: React.FC<FeedListProps> = ({feedGroups, setIsEndOfList}) => {
    const {fetchingStatus} = useFeedContext();
    useEffect(()=>{
        if(feedGroups){
            const option = {
                root: document.querySelector(`.${style['feed-list']}`),
            }
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if(entry.isIntersecting){
                        setIsEndOfList(true);
                    }
                })
            }, option);

            const target = document.querySelector(`.${style['lazy-target']}`);
            if(target){
                observer.observe(target);
            }
            return () => {
                if(target){
                    observer.unobserve(target);
                }
            }
        }
    },[feedGroups])
    return (
        <div className={style['feed-list']}>
            {
                feedGroups && feedGroups.length > 0 ?
                <>
                    {feedGroups.map((feedGroup, index) => {
                        return(
                            <FeedGroupComponent 
                                key={index}
                                feedGroup={feedGroup}
                            />
                        )
                    })}
                    <div className={style['lazy-target'] + " " + style[fetchingStatus]}>
                        {fetchingStatus === 'loading' && 
                            <LoadingIndicator/>
                        }
                        {fetchingStatus === 'failed' && <div>Failed to load, please try again.</div>}
                    </div>
                </>
                :
                <>
                    No feeds yet, make some buddies to see their feeds!
                </>
            }
        </div>
    );
};

export default FeedList;