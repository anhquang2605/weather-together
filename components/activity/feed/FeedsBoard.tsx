import { useState, useEffect } from 'react';
import style from './feeds-board.module.css';
import { Feed, FeedGroup } from '../../../types/Feed';
import { fetchFromGetAPI } from '../../../libs/api-interactions';
import { FeedContextProvider, FeedsContext, useFeedContext } from './FeedsContext';
import { unique } from 'next/dist/build/utils';
import FeedList from './feed-list/FeedList';
import { add, set } from 'lodash';
type FetchFunctionType = (path: string, params: any) => Promise<any>;
interface FeedsBoardProps {
    username: string;
    initialFeedGroups: FeedGroup[];
    initiallyHasMore: boolean;
    initialLastCursor: Date;
    buddiesUsernames: string[];
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
        initiallyHasMore, 
        initialFeedGroups,
        initialLastCursor,
        buddiesUsernames
    } = props;

    const FEEDS_PER_PAGE = 10;
    const {addFeeds, setHasMore, setFetchingStatus, feedGroups, hasMore, setLastCursor, lastCursor} = useFeedContext();
    const [endOfList, setEndOfList] = useState<boolean>(false);
    const SERVER_HOST = process.env.NEXT_PUBLIC_WS_SERVER_HOST;
    const SERVER_PORT = process.env.NEXT_PUBLIC_WS_SERVER_PORT;
    //helpers
    const fetchMore = async (username: string, lastCursor: Date) => {
       setFetchingStatus('loading');
       const response = await getFeedsByUsernames(buddiesUsernames, username, lastCursor)
       if(response && response.success){
            addFeeds(response.feedGroups, true);
            setHasMore(response.hasMore);
            setLastCursor(new Date(response.lastCursor));
            setFetchingStatus('success');
       }else{
            setFetchingStatus('failed');
       }
    }
    useEffect(() => {
        if(initialFeedGroups){
            addFeeds(initialFeedGroups, false);
            setHasMore(initiallyHasMore);
            setLastCursor(initialLastCursor);
        }
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
        if(endOfList && hasMore && initialFeedGroups){
            fetchMore(username, lastCursor);
        }   
    },[endOfList])
    return (
            <div className={style["feeds-board"]}>
                <FeedList setIsEndOfList={setEndOfList} feedGroups={feedGroups}/>
            </div>
    )
}

export const getFeedsByUsernames = async (usernames: string[], username:string, cursor?: Date) => {
    const path = 'feeds';
    const finalUsernames = usernames.join(',');
    const params:{
        usernames: string,
        username: string,
        cursor?: string,
    } = {
        usernames: finalUsernames,
        username,
    }
    if(cursor){
        params['cursor'] = typeof cursor === "object" ? cursor.toISOString() : cursor;
    }
    const res = await fetchFromGetAPI(path, params);
    if(res.success){
        return res;
    }else{
        return null;
    }
}