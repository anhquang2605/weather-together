import { useState, useEffect } from 'react';
import style from './feeds-board.module.scss';
import { Feed } from '../../types/Feed';
import { fetchFromGetAPI } from '../../libs/api-interactions';
import { FeedsContext } from './FeedsContext';
import { unique } from 'next/dist/build/utils';
type FetchFunctionType = (path: string, params: any) => Promise<any>;
interface FeedsBoardProps {
    username: string;
}
interface returnedFetchData {
    feeds: Feed[];
    hasMore: boolean;
}
interface ProfilePictureMap {
    [username: string]: string;
}
/* 
Fetch the feed items.
Extract distinct usernames from the feed items.
Use those usernames to make a separate request to fetch profile picture URLs.
Save the returned URLs in a JavaScript Map or an Object, where the key is the username and the value is the profile picture URL.
When displaying the feed items, you can then quickly look up the profile picture URL for each item using the username.
*/
export default function FeedsBoard (props: FeedsBoardProps) {
    const {
        username,
    } = props;

    const FEEDS_PER_PAGE = 10;
    const [loadingFeed, setLoadingFeed] = useState(new Set<number>());
    const [profilePictureMap, setProfilePictureMap] = useState<ProfilePictureMap>({});//[username: string]: string} = {}
    const [feeds, setFeeds] = useState<Feed[]>([]);
    const [currentTotalFeeds, setCurrentTotalFeeds] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [isPrepending, setIsPrepending] = useState(false);
    const [canLoadMore, setCanLoadMore] = useState(false);
    const [feedsBuffer, setFeedsBuffer] = useState<Feed[]>([]);
    const [relatedUsernamesInFeeds, setRelatedUsernamesInFeeds] = useState<Set<string>>(new Set([]));//[username: string] = [
    const SERVER_HOST = process.env.NEXT_PUBLIC_WS_SERVER_HOST;
    const SERVER_PORT = process.env.NEXT_PUBLIC_WS_SERVER_PORT;
    //helpers
    const getUniqueSetOfUsernamesFromFeeds = (feeds: Feed[]) => {
        let usernamesSet = new Set<string>();
        feeds.reduce((acc, feed) => {
            acc.add(feed.username);
            feed.relatedUser && acc.add(feed.relatedUser);
            return acc;
        }, usernamesSet)
        return usernamesSet;
    };
    const handleFetch = async (func: FetchFunctionType, path: string, params: any) => {
        setIsFetching(true);
        try{
            const data = await func(path, params);
            setIsFetching(false);
            return data;
        }catch(err){
            setIsFetching(false);
            throw err;
        }
    }
    const handlePrependFeeds = (data: Feed[]) => {
        setFeedsBuffer((prevFeeds) => [...data, ...prevFeeds]);
    };
    const handleSetFeeds = (data: returnedFetchData) => {
        const newFeeds = data.feeds;
        setFeeds((prevFeeds) => [...prevFeeds, ...newFeeds]);
        setCanLoadMore(data.hasMore);
        setRelatedUsernamesInFeeds(getUniqueSetOfUsernamesFromFeeds(newFeeds));
    }
    const getInitialFreeds = async () => {
        const params = {
            limit: FEEDS_PER_PAGE,
        }
        try{
            const data = await handleFetch(fetchFromGetAPI, '/get-feeds', params);
            handleSetFeeds(data);
        }catch(err){
            console.log(err);
        }
    };
    const getMoreFreeds = async () => {
        const currentOldestDate = feeds[feeds.length - 1].createdDate;
        const params = {
            limit: FEEDS_PER_PAGE,
            cursor: currentOldestDate,
        }
        try{
            const data = await handleFetch(fetchFromGetAPI, '/get-feeds', params);
            if(data.feeds.length > 0){
                handleSetFeeds(data);
            }
        }catch(err){
            console.log(err);
        }
        
    };
    useEffect(() => {
        getInitialFreeds();
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
              if(payload.type === 'feeds-added'){
                  handlePrependFeeds(payload.data);
              } 
  
          }
          return () => {
              ws.close();
          }
    },[]);
    useEffect(() => {
        if(feeds.length > 0){
            
        }
    }, [feeds.length]);
    return (
        <FeedsContext.Provider value={{
            loadingFeed: loadingFeed,
            profilePictureMap: profilePictureMap,
        }}>
            <div className={style["feeds-board"]}>
                {feedsBuffer.length > 0 && 
                    <button>
                        News feed added, load now
                    </button>
                }
                {feeds.length > 0 &&
                    <>
                        {/* FEEDS LIST GOES HERE */}
                    </>
                }
            </div>
        </FeedsContext.Provider>
    )
}