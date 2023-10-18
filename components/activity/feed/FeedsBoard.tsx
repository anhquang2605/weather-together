import { useState, useEffect } from 'react';
import style from './feeds-board.module.css';
import { Feed, FeedGroup } from '../../../types/Feed';
import { fetchFromGetAPI } from '../../../libs/api-interactions';
import { FeedContextProvider, FeedsContext, useFeedContext } from './FeedsContext';
import { unique } from 'next/dist/build/utils';
import FeedList from './feed-list/FeedList';
type FetchFunctionType = (path: string, params: any) => Promise<any>;
interface FeedsBoardProps {
    username: string;
    initialFeedGroups: FeedGroup[];
}
interface returnedFetchData {
    feedGroups: FeedGroup[];
    hasMore: boolean;
    success: boolean;
}

/* 
    Only job is to fetch the feeds, then pass the feeds to the context provider, also consolidate the feeds from the context provider, if the feed has the same targetId and username then it will be consolidated into one feed. we take the latest feed and add the username to the feed's username array.
*/
export default function FeedsBoard (props: FeedsBoardProps) {
    const {
        username,
        initialFeedGroups,
    } = props;

    const FEEDS_PER_PAGE = 10;
    const {addFeeds, setHasMore, setFetchingStatus} = useFeedContext();
    const [fetchAPIStatus, setFetchAPIStatus] = useState<string>("idle");

    const SERVER_HOST = process.env.NEXT_PUBLIC_WS_SERVER_HOST;
    const SERVER_PORT = process.env.NEXT_PUBLIC_WS_SERVER_PORT;
    //helpers
    
    useEffect(() => {
        
        const ws = new WebSocket(`${SERVER_HOST}:${SERVER_PORT}`);
        ws.onopen = () => {
            ws.send(JSON.stringify({
              type: 'username',
              package: 'feeds',
              username: username,
            }));
          
          }
          ws.onmessage = (message) => {
            const payload = JSON.parse(message.data);
              if(payload.type === 'feeds-changestream'){
                  
                  addFeeds(payload.data, false);
              } 
  
          }
          return () => {
              ws.close();
          }
    },[]);
    useEffect(()=>{
        if(initialFeedGroups.length > 0){
            addFeeds(initialFeedGroups, true);
        }
    },[])
    return (
            <div className={style["feeds-board"]}>
                <FeedList feedGroups={initialFeedGroups}/>
            </div>
    )
}