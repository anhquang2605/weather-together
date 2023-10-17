import React, { use, useEffect, useState } from 'react';
import style from './feed-list.module.css';
import { useFeedContext } from '../FeedsContext';
import { Feed, FeedGroup } from '../../../../types/Feed';
import FeedComponent from '../feed-component/FeedComponent';
import { set } from 'lodash';
import FeedGroupComponent from '../feed-group-component/FeedGroupComponent';

interface FeedListProps {
    feedGroups: FeedGroup[];
}

const FeedList: React.FC<FeedListProps> = ({feedGroups}) => {
    const {} = useFeedContext();
    const [feeds, setFeeds] = useState<Feed[]>([]);
    const getFeedsArray = (feedsmap: {[id: string]: Feed}) => {
        return Object.values(feedsmap);
    }

    return (
        <div className={style['feed-list']}>
            {
                feedGroups && feedGroups.length > 0 ?
                feedGroups.map((feedGroup, index) => {
                    return(
                        <FeedGroupComponent 
                            key={index}
                            feedGroup={feedGroup}
                        />
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