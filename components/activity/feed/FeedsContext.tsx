import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Feed, FeedGroup } from '../../../types/Feed';
import { insertToPostAPI } from '../../../libs/api-interactions';
import { UserBasic } from '../../../types/User';
type FeedsContextType = {
    hasMore: boolean,
    fetchingStatus: string,
    initialLoadingStatus: string,
    addFeeds: (newFeedGroups: FeedGroup[], isAppending: boolean) => void,
    setHasMore: (hasMore: boolean) => void,
    setFetchingStatus: (status: string) => void,
    setInitialLoadingStatus: (status: string) => void,
    setFeedById: (id: string, data: Partial<Feed>) => void,
    getFeedById: (id: string) => Feed | undefined,
    getFeeds: () => Feed[],
    feedGroups: FeedGroup[],
    setFeedGroups: React.Dispatch<React.SetStateAction<FeedGroup[]>>,
    usernameToBasicProfileMap: UsernameToBasicProfileMap,
    feedsMap: IDtoFeedMap,
    lastCursor: Date,
    setLastCursor: React.Dispatch<React.SetStateAction<Date>>,
    updateContentLoaded: () => void,
    allContentLoaded: boolean,
    username: string,
    setUsername: React.Dispatch<React.SetStateAction<string>> 
}
interface UsernameToBasicProfileMap{
    [username: string]: UserBasic
}
interface FeedContextProviderProps {
    children: React.ReactNode
}
interface IDtoFeedMap {
    [id: string]: Feed;
}
export const FeedsContext = createContext<FeedsContextType | null>(null);

export const useFeedContext = () => {
    const context = useContext(FeedsContext);
    if (context === null) {
        throw new Error('useFeedContext must be used within a FeedsProvider');
    }
    return context;
}

export function FeedContextProvider ({children}: FeedContextProviderProps) {
    const [usernameToBasicProfileMap, setUsernameToBasicProfileMap] = useState<UsernameToBasicProfileMap>({});//[username: string]: UserBasic} = {}
    const [feedsMap, setFeedsMap] = useState<IDtoFeedMap>({});
    const [feedGroups, setFeedGroups] = useState<FeedGroup[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [fetchingStatus, setFetchingStatus] = useState<string>("idle");
    const [initialLoadingStatus, setInitialLoadingStatus] = useState<string>("idle");
    const [lastCursor, setLastCursor] = useState<Date>(new Date());
    const [totalContentCount, setTotalContentCount] = useState<number>(0);
    const [contentLoadedCount, setContentLoadedCount] = useState<number>(0);
    const [allContentLoaded, setAllContentLoaded] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const updateContentLoaded = () => {
       setContentLoadedCount(prev => prev + 1);
    }
    const feedsMapRef = useRef(feedsMap);
    const setFeedById = (id: string, data: Partial<Feed>) => {
        const feed = feedsMap[id];
        if(feed){
            const updatedFeed = {...feed, ...data};
            setFeedsMap({...feedsMap, [id]: updatedFeed});
        }
    }
    const getFeedById = (id: string) => {
        return feedsMap[id];
    }
    const getFeeds = useCallback( () => {
        if(!feedsMapRef.current){
            
            return [];
        }
        return Object.values(feedsMapRef.current);
    },[]); 
    const addFeeds = async (newFeedGroups: FeedGroup[], isAppending: boolean) => {
        setAllContentLoaded(false);
        const newFeedsMap: IDtoFeedMap = {};
        const currentUniqueUsernames = new Set<string>();
        let noOfFeedGroupsWithContent = 0;
        const newFeeds = newFeedGroups.reduce((acc: Feed[], feedGroup: FeedGroup) => {
            const {feeds} = feedGroup;
            feeds.forEach(feed => {
                if(feedGroup.targetContentId !== ""){
                    noOfFeedGroupsWithContent++;
                }
                acc.push(feed);
            });
            return acc;
        },[]);
        newFeeds.forEach(feed => {
            newFeedsMap[feed._id as string] = feed;
            currentUniqueUsernames.add(feed.username);
            currentUniqueUsernames.add(feed.relatedUser as string);
            if(feed.relatedUsers && feed.relatedUsers.length > 0){
                feed.relatedUsers.forEach(relatedUser => {
                    currentUniqueUsernames.add(relatedUser);
                });
            }
        });
        const usernames = Array.from(currentUniqueUsernames);
        setTotalContentCount(prev => prev + noOfFeedGroupsWithContent);
        try{
            await addUsernameToBasicProfileMap(usernames);
        }catch(err){
            console.log(err);
        }
        
        if(isAppending){
            setFeedsMap(prevState =>  
                {
                    return {...prevState, ...newFeedsMap}
                }
            );
            setFeedGroups(prevState => [...prevState, ...newFeedGroups]);
        }else{
            setFeedsMap(prevState =>  
                {
                    return {...newFeedsMap, ...prevState}
                }
            );
            setFeedGroups(prevState =>  [...newFeedGroups, ...prevState]);
        }
    }
    

    const addUsernameToBasicProfileMap = async (usernames: string[]) => {
        const usernamesToFetch = usernames.filter(username => !usernameToBasicProfileMap[username]);
        if(usernamesToFetch.length === 0){
            return;
        }
        const path = 'user/by-usernames-basic';
        const res = await insertToPostAPI(path, usernamesToFetch);
        if(res.success){
            const newProfilePicturesMap: UsernameToBasicProfileMap = res.data.reduce((acc:UsernameToBasicProfileMap,user: UserBasic) => {
                acc[user.username] = user;
                return acc;
            },{});
            setUsernameToBasicProfileMap(
               prev => {
                     return {...prev, ...newProfilePicturesMap}
               }
            );
        }else{
            throw new Error(res.message);
        }
    }
    useEffect(() => {
        feedsMapRef.current = feedsMap;
    },[feedsMap]);
    useEffect(()=>{
        if(contentLoadedCount === totalContentCount && totalContentCount > 0){
            setAllContentLoaded(true);
        }
    },[contentLoadedCount])
    const value = {
        hasMore,
        fetchingStatus,
        initialLoadingStatus,
        addFeeds,
        setHasMore,
        setFetchingStatus,
        setInitialLoadingStatus,
        setFeedById,
        getFeedById,
        getFeeds,
        feedsMap,
        usernameToBasicProfileMap,
        feedGroups,
        setFeedGroups,
        lastCursor,
        setLastCursor,
        updateContentLoaded,
        allContentLoaded,
        username,
        setUsername,
    }
    return (
        <FeedsContext.Provider value={value}>
            {children}
        </FeedsContext.Provider>
    )
}