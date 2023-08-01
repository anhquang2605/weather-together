import { useState, useEffect } from 'react';
import style from './feeds-board.module.scss';
import { Feed } from '../../types/Feed';
import { fetchFromGetAPI } from '../../libs/api-interactions';
type FetchFunctionType = (path: string, params: any) => Promise<any>;
interface FeedsBoardProps {
    username: string;
}
interface returnedFetchData {
    feeds: Feed[];
    hasMore: boolean;
}
export default function FeedsBoard (props: FeedsBoardProps) {
    const {
        username,
    } = props;

    const FEEDS_PER_PAGE = 10;
    const [feeds, setFeeds] = useState<Feed[]>([]);
    const [currentTotalFeeds, setCurrentTotalFeeds] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [isPrepending, setIsPrepending] = useState(false);
    const [canLoadMore, setCanLoadMore] = useState(false);
    const [feedsBuffer, setFeedsBuffer] = useState<Feed[]>([]);
    const SERVER_HOST = process.env.NEXT_PUBLIC_WS_SERVER_HOST;
    const SERVER_PORT = process.env.NEXT_PUBLIC_WS_SERVER_PORT;
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
        setFeeds((prevFeeds) => [...prevFeeds, ...data.feeds]);
        setCanLoadMore(data.hasMore);
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
    return (
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
    )
}