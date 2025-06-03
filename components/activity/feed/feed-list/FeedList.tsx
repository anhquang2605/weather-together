import React, { use, useEffect, useState } from 'react';
import style from './feed-list.module.css';
import { useFeedContext } from '../FeedsContext';
import { Feed, FeedGroup } from '../../../../types/Feed';
import FeedComponent from '../feed-component/FeedComponent';
import { set } from 'lodash';
import FeedGroupComponent from '../feed-group-component/FeedGroupComponent';
import LoadingIndicator from '../../../loading-indicator/LoadingIndicator';

interface FeedListProps {
    setIsEndOfList: React.Dispatch<React.SetStateAction<boolean>>;
    onRendered: React.Dispatch<React.SetStateAction<boolean>>;
}

const FeedList: React.FC<FeedListProps> = ({ setIsEndOfList, onRendered}) => {
    const {fetchingStatus, feedGroups} = useFeedContext();
    useEffect(()=>{
        if(feedGroups){
            const option = {
                root: null,
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
    useEffect(()=>{
        onRendered(feedGroups && feedGroups.length > 0);
    },[
    ]);
    return (
        <div className={style['feed-list']}>
            {
                feedGroups && feedGroups.length > 0 ?
                <>
                    {feedGroups.sort((a,b) => {
                        return new Date(b.lastestCreatedDate).getTime() - new Date(a.lastestCreatedDate).getTime();
                    }).map((feedGroup, index) => {
                        return(
                            <FeedGroupComponent 
                                key={index}
                                feedGroup={feedGroup}
                            />
                        )
                    })}
                </>
                :
                <div className={style['no-feeds']}>
                    No feeds yet, make some buddies to see their feeds!
                </div>
            }
            {fetchingStatus === 'loading' &&
                <div className={style['loading'] + " h-vh"}>
                    <LoadingIndicator fluid={true}/>
                </div> 
                
            }
            {fetchingStatus === 'failed' && <div>Failed to load, please try again.</div>}
            <div className={style['lazy-target']}>
                      
            </div>
        </div>
    );
};

export default FeedList;