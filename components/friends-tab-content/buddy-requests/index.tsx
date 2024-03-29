import React, { useEffect, useState } from 'react';
import style from './buddy-request-tab-content.module.css';
import { UserInFriendRequests} from '../../../types/User';
import { useSession } from 'next-auth/react';
import { debounce, last, set } from 'lodash';
import { init } from 'next/dist/compiled/@vercel/og/satori';
import RequestsList from './requests-list/RequestsList';
import ToggleSwitch from '../../plugins/toggle-switch/ToggleSwitch';
import SearchBar from '../../plugins/search-bar/SearchBar';

interface BuddyRequestTabContentProps {

}
interface FriendRequestResponse {
    data: UserInFriendRequests[];
    hasMore: boolean;
    success: boolean;
    counts: number;
}
interface Mode{
    label: string;
    apiStatus: "idle" | "loading" | "success" | "error";
    list: UserInFriendRequests[];
    hasMore: boolean;
    lastCursor: Date | undefined;
    searchTerm: string;
    initiallyFetched: boolean;
    querySnapshot: string | undefined;
    counts: number;
    isFetching: boolean;
}

const BuddyRequestTabContent: React.FC<BuddyRequestTabContentProps> = ({}) => {
    const {data: session} = useSession();
    const account_user = session?.user;
    const account_username = account_user?.username || "";
    const SEARCH_LIMIT = 10;
    const [curMode, setCurMode] = useState<number>(0); //0: receiver, 1: sender
    const [mode, setMode] = useState<Mode[]>(
        [

            {
                label: "Received Requests",
                apiStatus: "idle",
                list: [],
                hasMore: false,
                lastCursor: undefined,
                searchTerm: "",
                initiallyFetched: false,
                querySnapshot: undefined,
                counts: 0,
                isFetching: false,
            },
            {
                label: "Requests Sent",
                apiStatus: "idle",
                list: [],
                hasMore: false,
                lastCursor: undefined,
                searchTerm: "",
                initiallyFetched: false,
                querySnapshot: undefined,
                counts: 0,
                isFetching: false,
            }
        ]
    );
    const [active, setActive] = useState<boolean>(false);
    const handleSetStateOfMode =<K extends keyof Mode> (mode: number, state: K, value: Mode[K] ) => {
        setMode((prev) => {
            const newState = [...prev];
            newState[mode][state] = value;
            return newState;
        })
    }
    const fetchUsers = async (username: string,  limit: number, active?: boolean, cursor?: Date, searchTerm?: string) => {

        const options = new URLSearchParams({
            username: username,
            limit: limit.toString(),
            active: active?.toString() || 'false',
        })
        if (cursor) {
            options.append('lastCursor',  typeof cursor === "object" ? cursor.toISOString() : cursor);
        }
        if (searchTerm) {
            options.append('searchTerm', searchTerm);
        }
        const path = `/api/friend-requests?${options.toString()}`;
        try{
            const response = await fetch(path);
            if(response.ok && response.status === 200){
                return await response.json();
            } else {
                handleSetStateOfMode(curMode, "apiStatus", "error");
                return {success: false};
            }
        } catch (error) {
            console.error(error);
            handleSetStateOfMode(curMode, "apiStatus", "error");
            return {success: false};
        }   
    }
    const handleSetFetchResult = (response: FriendRequestResponse, append: boolean) => {
        if(response.success){
            if(append){
                handleSetStateOfMode(curMode, "list", [...mode[curMode].list, ...response.data]);
            }else{
                handleSetStateOfMode(curMode, "list", response.data);
            }
            handleSetStateOfMode(curMode, "hasMore", response.hasMore);
            handleSetStateOfMode(curMode, "counts", response.counts);
        }

    }
    const handleInitialFetch = async () => {
        handleSetStateOfMode(curMode, "apiStatus", "loading");
        const response = await fetchUsers(account_username, SEARCH_LIMIT, active);
        if(response.success){
            handleSetStateOfMode(curMode, 'initiallyFetched', true);
            handleSetStateOfMode(curMode, "apiStatus", "success");
            handleSetFetchResult(response, false);
        }else{
            handleSetStateOfMode(curMode, "apiStatus", "error");
            handleSetStateOfMode(curMode, "initiallyFetched", false);
        }
    }
    const handleFetchMore = async () => {
        handleSetStateOfMode(curMode, 'isFetching', true);
        const response = await fetchUsers(account_username , SEARCH_LIMIT, active, mode[curMode].lastCursor, mode[curMode].searchTerm);
        if(response.success){
            handleSetFetchResult(response, true);
            handleSetStateOfMode(curMode, 'isFetching', false);
        }else{
            handleSetStateOfMode(curMode, "apiStatus", "error");
        }
    }
    const debouncedFetchMore = debounce(handleFetchMore, 500);
    const updateFriendRequest = async (index: number, updatedFields: Partial<UserInFriendRequests>) => {
        const friendRequest = mode[curMode].list[index];
        const updatedFriendRequest = {...friendRequest, ...updatedFields};
        const newList = [...mode[curMode].list];
        newList[index] = updatedFriendRequest;
        handleSetStateOfMode(curMode, "list", newList);
    }
    const handleOnSearch = async () => {
        const query = mode[curMode].searchTerm;
        const lastCursor = new Date();
        const querySnapshot = mode[curMode].querySnapshot;
        if(query === mode[curMode].querySnapshot){
            return;
        }
        handleSetStateOfMode(curMode, "apiStatus", "loading");
        const response = await fetchUsers(account_username, SEARCH_LIMIT, active, lastCursor,  query);
        if(response.success){
            handleSetStateOfMode(curMode, "apiStatus", "success");
            handleSetFetchResult(response, false);
            handleSetStateOfMode(curMode, "querySnapshot", query);
        }else{
            handleSetStateOfMode(curMode, "apiStatus", "error");
        }
        
    }
    useEffect(()=>{
        if(mode[curMode].initiallyFetched){
            handleInitialFetch();
        }
    },[]);
    useEffect(() => {
        if(mode[curMode].list.length > 0){
            mode[curMode].lastCursor = mode[curMode].list[mode[curMode].list.length - 1].createdDate;
        }
    }, [mode[curMode].list]);
    useEffect(()=>{
        setCurMode(active === true ? 1 : 0);
    }, [active])
    useEffect(()=>{
        if(!mode[curMode].initiallyFetched){
            console.log(curMode);
            handleInitialFetch();
        }
    },[curMode])

    return (
        <div className={style['buddy-request-tab-content']}>
            <div className={style['control-group']}>
                <div className={style['search-bar-container']}>
                    <SearchBar 
                        variant='bordered'
                        query={mode[curMode].searchTerm}
                        setQuery={(event) => handleSetStateOfMode(curMode, "searchTerm", event.target.value)}
                        onSearch={handleOnSearch}
                        placeholder='Search among requests'
                    />
                </div>

                <ToggleSwitch
                    onLabel= {mode[1].label}
                    offLabel= {mode[0].label}
                    on={active} 
                    setToggle={setActive}
                />
            </div>

           <RequestsList 
                isFetching={mode[curMode].isFetching}
                friendRequestUpdater={updateFriendRequest} 
                fetchMore={debouncedFetchMore} 
                curMode={curMode} 
                users={mode[curMode].list} 
                hasMore={mode[curMode].hasMore} 
                apiStatus={mode[curMode].apiStatus}
                counts={mode[curMode].counts}    
            /> 
        </div>
    );
};

export default BuddyRequestTabContent;

