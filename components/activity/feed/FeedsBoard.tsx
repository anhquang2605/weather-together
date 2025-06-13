import { useState, useEffect} from 'react';
import style from './feeds-board.module.css';
import { FeedGroup } from '../../../types/Feed';
import { fetchFromGetAPI } from '../../../libs/api-interactions';
import { useFeedContext } from './FeedsContext';
import FeedList from './feed-list/FeedList';
import { debounce, set } from 'lodash';
import LoadingIndicator from '../../loading-indicator/LoadingIndicator';

interface FeedsBoardProps {
    username: string;
    buddiesUsernames: string[];
}

/* 
    Only job is to fetch the feeds, then pass the feeds to the context provider, also consolidate the feeds from the context provider, if the feed has the same targetId and username then it will be consolidated into one feed. we take the latest feed and add the username to the feed's username array.
*/
export default function FeedsBoard (props: FeedsBoardProps) {
    const {
        username,
        buddiesUsernames
    } = props;

    const {addFeeds, setHasMore, setFetchingStatus, hasMore, setLastCursor, lastCursor,  setUsername , fetchingStatus} = useFeedContext();
    const [endOfList, setEndOfList] = useState<boolean>(false);
    const [listRendered, setListRendered] = useState<boolean>(false);
    const SERVER_HOST = process.env.NEXT_PUBLIC_WS_SERVER_HOST;
    const SERVER_PORT = process.env.NEXT_PUBLIC_WS_SERVER_PORT;
    //helpers
    const fetchMore = debounce(async (username: string, lastCursor: Date) => {
       setFetchingStatus('loading');
       const response = await getFeedsByUsernames(buddiesUsernames, username, lastCursor)
       console.log("response", response);
       if(response && response.success){
            if(response.feedGroups.length > 0){
                addFeeds(response.feedGroups, true);
            }
            setHasMore(response.hasMore);
            setLastCursor(new Date(response.lastCursor));
            setFetchingStatus('success');
            //wait until the list is rendered then set the end of list to false
            setTimeout(()=>{
                setEndOfList(false);
            },2000)
       }
        else {
            setFetchingStatus('error');
       }
    },500)
    useEffect(() => {
        if(username){
            setUsername(username);
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
                  if(payload.data.length === 0) return;
                  addFeeds(payload.data, false);
              } 
  
          }
          return () => {
              ws.close();
          }
    },[]);
    useEffect(()=>{
        if(endOfList && hasMore){
            fetchMore(username, lastCursor);
        }
    },[endOfList])
    return (
            <div className={style["feeds-board"]}>
                {
                    fetchingStatus === 'loading' ? 
                        <div className="w-full h-full flex items-center justify-center py-16 px-8">
                            <LoadingIndicator />
                            <div>Fetching Feeds</div>
                        </div>
                    :
                    <FeedList setIsEndOfList={setEndOfList} onRendered={setListRendered}/>
                }
                
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