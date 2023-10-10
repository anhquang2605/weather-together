import { createContext, useContext, useState } from 'react';
import { Feed } from '../../../types/Feed';
import { insertToPostAPI } from '../../../libs/api-interactions';
type FeedsContextType = {
    hasMore: boolean,
    fetchingStatus: string,
    initialLoadingStatus: string,
    addFeeds: (newFeeds: Feed[], isAppending: boolean) => void,
    setHasMore: (hasMore: boolean) => void,
    setFetchingStatus: (status: string) => void,
    setInitialLoadingStatus: (status: string) => void,
    setFeedById: (id: string, data: Partial<Feed>) => void,
    getFeedById: (id: string) => Feed | undefined,
    getFeeds: () => Feed[],
    profilePicturesMap: UsernameToProfilePictureMap
}
interface FeedContextProviderProps {
    children: React.ReactNode
}
interface IDtoFeedMap {
    [id: string]: Feed;
}
export interface UsernameToProfilePictureMap {
    [username: string]: string;
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
    const [profilePicturesMap, setProfilePicturesMap] = useState<UsernameToProfilePictureMap>({});//[username: string]: string} = {}
    const [feedsMap, setFeedsMap] = useState<IDtoFeedMap>({});
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [fetchingStatus, setFetchingStatus] = useState<string>("idle");
    const [initialLoadingStatus, setInitialLoadingStatus] = useState<string>("idle");
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
    const getFeeds = () => {
        return Object.values(feedsMap);
    }
    const addFeeds = async (newFeeds: Feed[], isAppending: boolean) => {
        const newFeedsMap: IDtoFeedMap = {};
        const currentUniqueUsernames = new Set<string>();
        newFeeds.forEach(feed => {
            newFeedsMap[feed._id as string] = feed;
            currentUniqueUsernames.add(feed.username);
        });
        const usernames = Array.from(currentUniqueUsernames);
        try{
            await handleFetchProfilePictures(usernames);
        }catch(err){
            console.log(err);
        }
        
        if(isAppending){
            setFeedsMap({...feedsMap, ...newFeedsMap});
        }else{
            setFeedsMap({...newFeedsMap, ...feedsMap});
        }
    }
   
    const handleFetchProfilePictures = async (usernames: string[]) => {
        //check if profilePictureMap has the username, if not then fetch the profile picture path and set the profilePictureMap
        const usernamesToFetch = usernames.filter(username => !profilePicturesMap[username]);
        if(usernamesToFetch.length === 0){
            return;
        }
        const path = 'user/profile-pictures';
        const res = await insertToPostAPI(path, usernamesToFetch);
        if(res.success){
            const newProfilePicturesMap: UsernameToProfilePictureMap = res.data;
            setProfilePicturesMap({...profilePicturesMap, ...newProfilePicturesMap});
        }else{
            throw new Error(res.message);
        }
    }
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
        profilePicturesMap
    }
    
    return (
        <FeedsContext.Provider value={value}>
            {children}
        </FeedsContext.Provider>
    )
}