import React, { use, useEffect, useState } from 'react';
import style from './feed-list.module.css';
import { useFeedContext } from '../FeedsContext';
import { Feed } from '../../../../types/Feed';
import FeedComponent from '../feed-component/FeedComponent';

interface FeedListProps {

}

const FeedList: React.FC<FeedListProps> = ({}) => {
    const {getFeeds, feedsMap} = useFeedContext();
    const [feeds, setFeeds] = useState<Feed[]>([]);
    const getFeedsArray = (feedsmap: {[id: string]: Feed}) => {
        return Object.values(feedsmap);
    }

    useEffect(() => {
        if(feedsMap){
            setFeeds(getFeedsArray(feedsMap));
        }
    },[feedsMap]);
    useEffect(()=>{
        //group by targer
        console.log(feeds);
    },[feeds])
    return (
        <div className={style['feed-list']}>
            {
                feeds ? feeds.map((feed, index) => {
                    return (
                        <FeedComponent key={index} feed={feed}/>
                    )   
                })
                :
                <>
                    No feeds yet, make some buddies to see their feeds!
                </>
            }
        </div>
    );
};

export default FeedList;