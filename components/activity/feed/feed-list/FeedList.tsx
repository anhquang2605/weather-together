import React, { use, useEffect } from 'react';
import style from './feed-list.module.css';
import { useFeedContext } from '../FeedsContext';

interface FeedListProps {

}

const FeedList: React.FC<FeedListProps> = ({}) => {
    const {getFeeds} = useFeedContext();
    useEffect(() => {
        console.log(getFeeds());
    },[]);
    return (
        <div className={style['feed-list']}>
            FeedList
        </div>
    );
};

export default FeedList;