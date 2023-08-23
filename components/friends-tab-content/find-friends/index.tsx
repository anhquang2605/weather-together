import { useContext, useEffect, useState } from 'react'
import style from './find-friends.module.css'
import SearchBar from '../../plugins/search-bar/SearchBar'
import { UserInClient} from './../../../types/User'
import { useSession } from 'next-auth/react';
import FriendSearchResultList from './result-list/FriendSearchResultList';
import { getCitiesFromLongLat } from '../../../libs/geodb';
import SuggestionDropDown from '../../plugins/search-bar/suggestion-drop-down/SuggestionDropDown';
import UserSearchCard from '../../user/user-search-card/UserSearchCard';
import { FriendsContext } from '../../../pages/friends/FriendsContext';
import {  UserFilter, useFilter } from './FilterContext';
import FilterGroup from './filter-group/FilterGroup';

function debounce(func:Function, duration:number) {
    let timer: ReturnType<typeof setTimeout>;
    return  (...args: any[]) => {
        let context = this;//will be referring to the component instance that calls the debounced function not the closure, the closure here is to store the timer variable so we can clear it when the function is called again
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(context, args);
        },duration);
    }
}
interface FindFriendsProps {
    
}

export default function FindFriends({}:FindFriendsProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState<UserInClient[]>([]); //
    const [searchResults, setSearchResults] = useState<UserInClient[]>([]); //
    const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "success" | "error">("idle"); //
    const [searchStarted, setSearchStarted] = useState(false); //
    const {filter, setFilter} = useFilter();
    const {data: session} = useSession();
    const user = session?.user;
    const {friendUsernames} = useContext(FriendsContext);
    const SEARCH_LIMIT = 10;
    const getAPIOptions = {
        method: 'GET'
    }
    const debounceSearch = debounce( async(searchQuery: string) => {
        try {
            const response = await fetch(`/api/user/atlas-search?query=${searchQuery}&username=${user?.username}`,getAPIOptions);
            if(response.ok){
                const data = await response.json();
                setSearchSuggestions(data.data);
              
            }
        } catch (error) {
           console.log(error);
        }
    } ,500);
    const handleSearchBarInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }
    const handleFilterResultByNearbyCities = async () => {
        const cities = await getCitiesFromLongLat(user?.location?.latitude ?? "", user?.location?.longitude ?? "",'40');
        //handleFilterSet(filter, "nearbyCities", cities);
    }
    const handleSearchUsers = async (query:string, username:string, limit: number) => {
        try {
            setApiStatus("loading");
            const response = await fetch(`/api/user/atlas-search?query=${query}&username=${username}&limit=${limit}`,getAPIOptions);

            return response;
        } catch (error) {
            console.log(error);
            setApiStatus("error");
        }
    }
    const handleSearchFriends = async (friendUsernames: Set<string>) => {
        try{
            setApiStatus("loading");
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Array.from(friendUsernames))
            }
            const path = '/api/user/by-usernames'
            const response = await fetch(path, option);
            return response;
        }catch(e){
            console.log(e);
            setApiStatus("error");
        }
    }
    const handleOnSearch = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const response = await handleSearchUsers(searchQuery, user?.username ?? "",SEARCH_LIMIT);
        setSearchSuggestions([]);
        if(response){
            handleResponseFromSearchEndpoints(response);
        }else{
            setApiStatus("error");
            setSearchResults([]);
        }
    }
    const handleGetResultsFromNearby = async () => {
        const response = await fetch(`/api/users?city=${user?.location?.city}`);
        return response;
    }
    const handleInitialSearch = async () => {
        let response: Response | undefined;
        if(friendUsernames.size > 0){
            response = await handleSearchFriends(friendUsernames);
        }
 
        if(response){
            if(response.status === 204){
                response = await handleGetResultsFromNearby();
                if(response && response.status === 204){
                    setApiStatus('idle');
                    return;
                }
            }
            if(response.status === 200){
                handleResponseFromSearchEndpoints(response);
            }
        }else{
            setApiStatus("error");
            setSearchResults([]);
        }
    }
    const handleFilterSearch = async (filter: UserFilter) => {

    }
    const handleResponseFromSearchEndpoints = async (response: Response, callback?:()=>void) => {
            const data = await response.json();
            setSearchResults(data.data);
            setApiStatus("success");
    }
    const suggestionRenderer = (suggestion: UserInClient, index: number) => {
        return (
            <div key={index} className={style['suggestion-item']}>
                <UserSearchCard variant={'small'} user={suggestion}/>
            </div>
        )
    }
    useEffect(() => {
        //getCitiesFromLongLat(user?.location?.latitude ?? "", user?.location?.longitude ?? "",'40')
        handleInitialSearch();
    }, []);
    useEffect(()=>{
        console.log(apiStatus);
    },[apiStatus])
    useEffect(()=>{
        if(searchQuery.length > 0){
            debounceSearch(searchQuery);
        }else{
            setSearchSuggestions([]);
        }
    },[searchQuery])
        return (
            <div className={style['find-friends']}>
                <div className={style.controlGroup}>
                    <div className={style["search-bar-control-group"]}>
                        <SearchBar placeholder='Search for new friends' query={searchQuery} setQuery={handleSearchBarInputChange} onSearch={handleOnSearch}/>
                        <SuggestionDropDown searchStarted={searchStarted} suggestions={searchSuggestions} suggestionRenderer={suggestionRenderer} />
                    </div>
                    <FilterGroup/>
                </div>

            <FriendSearchResultList apiStatus={apiStatus} results={searchResults}/>
            </div>
    )
}