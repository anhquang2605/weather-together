import React, { useState } from 'react';
import style from './buddy-request-tab-content.module.css';
import { UserInFriendRequests} from '../../../types/User';
import { useSession } from 'next-auth/react';
import { FriendRequest } from '../../../types/FriendRequest';
import { UserFilter } from '../find-friends/FilterContext';
import { set } from 'lodash';

interface BuddyRequestTabContentProps {

}
interface FriendRequestResponse {
    data: UserInFriendRequests[];
    hasMore: boolean;
    success: boolean;
}
const BuddyRequestTabContent: React.FC<BuddyRequestTabContentProps> = ({}) => {
    const {data: session} = useSession();
    const account_user = session?.user;
    const [potentialBuddies, setPotentialBuddies] = useState<UserInFriendRequests[]>([]);
    const SEARCH_LIMIT = 10;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [initiallyFetched, setInitiallyFetched] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [lastCursor, setLastCursor] = useState<Date | undefined>(undefined);
    const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [active, setActive] = useState<boolean>(false);
    const handleResetState = () => {
        setPotentialBuddies([]);
        setSearchTerm('');
        setInitiallyFetched(false);
        setLastCursor(undefined);
        setApiStatus("idle");
    }
    const fetchUsers = async (username: string,  limit: number, active?: boolean, cursor?: Date,) => {
        setApiStatus("loading");
        const options = new URLSearchParams({
            username: username,
            limit: limit.toString(),
            active: active?.toString() || 'false',
        })
        if (cursor) {
            options.append('lastCursor',  typeof cursor === "object" ? cursor.toISOString() : cursor);
        }
        const path = `/api/friend-requests?${options.toString()}`;
        try{
            const response = await fetch(path);
            if(response.ok && response.status === 200){
                return await response.json();
            }
        } catch (error) {
            console.error(error);
            setApiStatus("error");
        }   
    }
    const handleSetFetchResult = (response: FriendRequestResponse, append: boolean) => {
        if(append){
            setPotentialBuddies((prev) => [...prev, ...response.data]);
        }
        if(response.success){
            setPotentialBuddies(response.data);
            setHasMore(response.hasMore);
        }
    }
    const handleInitialFetch = async () => {
        const response = await fetchUsers(searchTerm, SEARCH_LIMIT, active);
        if(response.success){
            setInitiallyFetched(true);
            setApiStatus("success");
            handleSetFetchResult(response, false);
        }else{
            setApiStatus("error");
            setInitiallyFetched(false);
        }
    }
    const handleFetchMore = async () => {
        const response = await fetchUsers(searchTerm, SEARCH_LIMIT, active, lastCursor);
        if(response.success){
            setApiStatus("success");
            handleSetFetchResult(response, true);
        }else{
            setApiStatus("error");
        }
    }
    useEffect(()=>{
        if(!initiallyFetched){
            handleInitialFetch();
        }
    },[]);
    useEffect(() => {
        if(potentialBuddies.length > 0){
            setLastCursor(potentialBuddies[potentialBuddies.length - 1].createdDate);
        }
    }, [potentialBuddies]);
    useEffect(()=>{
        handleResetState();
        handleInitialFetch();
    }, [active] )
    return (
        <div className={style['buddy-request-tab-content']}>
            
        </div>
    );
};

export default BuddyRequestTabContent;

function useEffect(arg0: () => void, arg1: UserInFriendRequests[][]) {
    throw new Error('Function not implemented.');
}
