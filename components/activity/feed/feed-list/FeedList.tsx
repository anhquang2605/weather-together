import React, { use, useEffect, useState } from 'react';
import style from './feed-list.module.css';
import { useFeedContext } from '../FeedsContext';
import { Feed } from '../../../../types/Feed';
import FeedComponent from '../feed-component/FeedComponent';

interface FeedListProps {

}

const FeedList: React.FC<FeedListProps> = ({}) => {
    const {getFeeds} = useFeedContext();
    const [feeds, setFeeds] = useState<Feed[]>([]);
    useEffect(() => {
        if(getFeeds().length > 0){
            console.log("getFeeds", getFeeds());
            setFeeds(getFeeds());
        }
    },[getFeeds]);
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