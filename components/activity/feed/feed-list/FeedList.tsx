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
        console.log('feeds', feeds);
    },[feeds])
    return (
        <div className={style['feed-list']}>
            {
                feeds.length > 0 && feeds.map((feed, index) => {
                    return (
                        <FeedComponent key={index} feed={feed}/>
                    )   
                })
            }
        </div>
    );
};

export default FeedList;