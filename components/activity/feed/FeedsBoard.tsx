import { useState, useEffect, useRef } from 'react';
import style from './feeds-board.module.css';
import { Feed, FeedGroup } from '../../../types/Feed';
import { fetchFromGetAPI } from '../../../libs/api-interactions';
import { FeedContextProvider, FeedsContext, useFeedContext } from './FeedsContext';
import { unique } from 'next/dist/build/utils';
import FeedList from './feed-list/FeedList';
import { add, debounce, set } from 'lodash';
import { time } from 'console';
type FetchFunctionType = (path: string, params: any) => Promise<any>;
interface FeedsBoardProps {
    username: string;
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
        buddiesUsernames
    } = props;
    const feedListRef = useRef<HTMLDivElement>(null);
    const FEEDS_PER_PAGE = 10;
    const {addFeeds, setHasMore, setFetchingStatus, feedGroups, hasMore, setLastCursor, lastCursor, allContentLoaded} = useFeedContext();
    const [endOfList, setEndOfList] = useState<boolean>(false);
    const [listRendered, setListRendered] = useState<boolean>(false);
    const SERVER_HOST = process.env.NEXT_PUBLIC_WS_SERVER_HOST;
    const SERVER_PORT = process.env.NEXT_PUBLIC_WS_SERVER_PORT;
    //helpers
    const fetchMore = debounce(async (username: string, lastCursor: Date) => {
       setFetchingStatus('loading');
       const response = await getFeedsByUsernames(buddiesUsernames, username, lastCursor)
       if(response && response.success){
            addFeeds(response.feedGroups, true);
            setHasMore(response.hasMore);
            setLastCursor(new Date(response.lastCursor));
            setFetchingStatus('success');
            //wait until the list is rendered then set the end of list to false
            setTimeout(()=>{
                setEndOfList(false);
            },2000)

            //setEndOfList(false);
       }else{
            setFetchingStatus('failed');
       }
    },500)
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
        let timeout: NodeJS.Timeout;
        if(endOfList && hasMore){
            fetchMore(username, lastCursor);
        }
    },[endOfList])
    return (
            <div className={style["feeds-board"]}>
                <FeedList setIsEndOfList={setEndOfList} onRendered={setListRendered}/>
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