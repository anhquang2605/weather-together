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
interface SortCriterion {
    [key: string]: boolean; //true for ascending, false for descending
}
const sortComparators = {
    dateJoined: (a: UserInClient, b: UserInClient) => {
        return a.dateJoined.getTime() - b.dateJoined.getTime();
    },
    firstName: (a: UserInClient, b: UserInClient) => {
        return a.firstName.localeCompare(b.firstName);
    },
    lastName: (a: UserInClient, b: UserInClient) => {
        return a.lastName.localeCompare(b.lastName);
    }
}
export default function FindFriends({}:FindFriendsProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortCriteria, setSortCriteria] = useState<SortCriterion>({
        dateJoined: false,
        firstName: true,
        lastName: true
    });//used to sort users in search
    const [currentSortCriterion, setCurrentSortCriterion] = useState<string>('dateJoined');
    const [lastTimeStramp, setLastTimeStramp] = useState<Date | null>(null);//used to fetch users in search
    const [searchSuggestions, setSearchSuggestions] = useState<UserInClient[]>([]); //
    const [searchResults, setSearchResults] = useState<UserInClient[]>([]); //
    const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "success" | "error">("idle"); //
    const [searchStarted, setSearchStarted] = useState(false); //
    const {filter} = useFilter();
    const {data: session} = useSession();
    const user = session?.user;
    const {friendUsernames} = useContext(FriendsContext);
    const SEARCH_LIMIT = 10;
    const getAPIOptions = {
        method: 'GET'
    }
    const handleFlipSortCriterion = (criterion: string) => {
        setSortCriteria((prev) => {
            return {
                ...prev,
                [criterion]: !prev[criterion]
            }
        });
    }
    const getSortComparator = (criterion: string, a:UserInClient, b:UserInClient, isAscending: boolean) => {
        const comparitor = sortComparators[criterion as keyof typeof sortComparators];
        return isAscending ? comparitor(a,b) : comparitor(b,a);
    }
    
    const mergeSort = (currSorted: UserInClient[], fetched: UserInClient[], criterion: string, order: boolean) => {
        const merged = [];
        let i = 0;
        let j = 0;//we know that fetched is sorted and is less in length
        //edge cases: 
        if(currSorted.length === 0){
            return fetched;
        }
        else if(fetched.length === 0){
            return currSorted;
        }
        if(order){
            //if accending, if the incoming list's first element is .
            if(getSortComparator(criterion, currSorted[currSorted.length - 1], fetched[0],true) < 0){
                return [...currSorted, ...fetched];
            } else if (getSortComparator(criterion, currSorted[0], fetched[fetched.length - 1], true) > 0){
                return [...fetched, ...currSorted];
            }
        }else {
            if(getSortComparator(criterion, currSorted[currSorted.length - 1], fetched[0],true) > 0){
                return [...currSorted, ...fetched];
            }else if(getSortComparator(criterion, currSorted[0], fetched[fetched.length - 1], true) < 0){
                return [...fetched, ...currSorted];
            }
        }
        while(j<fetched.length){
            //we want to insert the fetched element into the sorted array
            //check the order of the current criterion, if ascending, which ever smaller will be added to the merged array first, if descending, which ever larger will be added to the merged array first
            const comparison = getSortComparator(criterion, currSorted[i], fetched[j], order);

            if ((order && comparison < 0) || (!order && comparison > 0)) {
                merged.push(currSorted[i]);
                i++;
            } else {
                merged.push(fetched[j]);
                j++;
            }
        }
        for(let k = i; k < currSorted.length; k++){
            merged.push(currSorted[k]);
        }
        return merged;
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
    const handleFilterFetch = async (filter: UserFilter, lastCursor: Date) => {
        const params = new URLSearchParams({
            limit: SEARCH_LIMIT.toString(),
            lastCursor: lastCursor.toISOString(),
            filter: JSON.stringify(filter)
        });
        const response = await fetch(`/api/user/filter?${params.toString()}`);
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
    useEffect(()=>{
        if(searchResults.length > 0){
            setLastTimeStramp(searchResults[searchResults.length - 1].dateJoined);
        }
    },[searchResults])
        return (
            <div className={style['find-friends']}>
                <div className={style.controlGroup}>
                    <div className={style["search-bar-control-group"]}>
                        <SearchBar placeholder='Search for new friends' query={searchQuery} setQuery={handleSearchBarInputChange} onSearch={handleOnSearch}/>
                        <SuggestionDropDown searchStarted={searchStarted} suggestions={searchSuggestions} suggestionRenderer={suggestionRenderer} />
                    </div>
                    {/* <FilterGroup handleFilterSearch={handleFilterFetch}/> */}
                </div>

            <FriendSearchResultList  apiStatus={apiStatus} results={searchResults}/>
            </div>
    )
}