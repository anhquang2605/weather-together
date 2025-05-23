import { useContext, useEffect, useState } from 'react'
import style from './find-friends.module.css'
import SearchBar from '../../plugins/search-bar/SearchBar'
import { UserInSearch} from './../../../types/User'
import { useSession } from 'next-auth/react';
import FriendSearchResultList from './result-list/FriendSearchResultList';
import { getCitiesFromLongLat, getNearbyCityNamesByLongLatName } from '../../../libs/geodb';
import SuggestionDropDown from '../../plugins/search-bar/suggestion-drop-down/SuggestionDropDown';
import UserSearchCard from '../../user/user-search-card/UserSearchCard';
import { FriendsContext } from '../../../context/FriendsContext';
import {  UserFilter, useFilter } from './FilterContext';
import {IoArrowBack, IoFilter} from 'react-icons/io5';
import FilterGroup from './filter-group/FilterGroup';

function debounce<T extends (...args: any[]) => any>(
  func: T,
  duration: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, duration);
  };
}
interface FindFriendsProps {
    
}
interface SortCriterion {
    [key: string]: boolean; //true for ascending, false for descending
}
const sortComparators = {
    dateJoined: (a: UserInSearch, b: UserInSearch) => {
        return a.dateJoined.getTime() - b.dateJoined.getTime();
    },
    firstName: (a: UserInSearch, b: UserInSearch) => {
        return a.firstName.localeCompare(b.firstName);
    },
    lastName: (a: UserInSearch, b: UserInSearch) => {
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
    const [initiallyFetched, setInitiallyFetched] = useState(false);//used to fetch users in search
    const [lastTimeStramp, setLastTimeStramp] = useState<Date | undefined>();//used to fetch users in search
    const [searchSuggestions, setSearchSuggestions] = useState<UserInSearch[]>([]); //
    const [searchResults, setSearchResults] = useState<UserInSearch[]>([]); //
    const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "success" | "error">("idle"); //
    const [searchStarted, setSearchStarted] = useState(false); //
    const [hasMore,setHasMore] = useState(true); //
    const {filter, filterBusy} = useFilter();
    const {data: session} = useSession();
    const user = session?.user;
    const {friendUsernames} = useContext(FriendsContext);
    const SEARCH_LIMIT = 7;
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
    const getSortComparator = (criterion: string, a:UserInSearch, b:UserInSearch, isAscending: boolean) => {
        const comparitor = sortComparators[criterion as keyof typeof sortComparators];
        const ascMultiplier = isAscending ? 1 : -1;
        const diff = ascMultiplier * comparitor(a,b)
        if(diff === 0){
            return ascMultiplier * sortComparators.dateJoined(a,b);
        }
        return diff;
        
    }
    
    const mergeSort = (currSorted: UserInSearch[], fetched: UserInSearch[], criterion: string, order: boolean) => {
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
    const resetSort = () => {
        setSortCriteria({
            dateJoined: false,
            firstName: true,
            lastName: true
        });
        setCurrentSortCriterion('dateJoined');
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
        const path = '/api/user/by-citynames';
        const cities = await getNearbyCityNamesByLongLatName(user?.location?.latitude ?? "", user?.location?.longitude ?? "",'100', user?.location?.city ?? "");
        cities.push(user?.location?.city ?? "")
        const data = {
            cities,
            limit: SEARCH_LIMIT,
            username: user?.username
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(path, options);
        return response;
    }
    const handleInitialSearch = async () => {
        const response = await handleFetch(filter);
        if(response && response.status === 204){
            setApiStatus('idle');
            return;
        }
        if(response.status === 200){
            handleResponseFromSearchEndpoints(response);
            setInitiallyFetched(true);
        }else{
            setApiStatus("error");
            setSearchResults([]);
        }
    }
    const handleApplyFilter = async (filter: UserFilter) => {
        setApiStatus("loading");
        const response = await handleFetch(filter);

        if(response.status === 200){
            handleResponseFromSearchEndpoints(response);
        }else{
            setApiStatus("error");
            setSearchResults([]);
        }
    }
    const handleSetResults = (results: UserInSearch[], more: boolean, isAppendending?: boolean) => {
        let finalResults = []
        let convertedResults = results.map((user:UserInSearch) => {
            return {
                ...user,
                dateJoined: new Date(user.dateJoined)
            }
        })
        if(isAppendending){ 
            finalResults = [...searchResults, ...convertedResults];
        } else {
            finalResults = convertedResults;
        }
        setSearchResults(finalResults);
        setHasMore(more);
    }
    const handleFetch = async (filter:UserFilter, lastCursor?: Date) => {
        const rawParams = {
            limit: SEARCH_LIMIT.toString(),
            filter: JSON.stringify(filter),
            username: user?.username ?? ""
        }
        if(lastCursor){
            rawParams['lastCursor' as keyof typeof rawParams] = typeof lastCursor === "object" ? lastCursor.toISOString() : lastCursor;
        }
        const params = new URLSearchParams(rawParams);
        const response = await fetch(`/api/user/atlas-search?${params.toString()}`);
        return response;
    }
    const handleFetchMore = async (filter: UserFilter, lastCursor: Date | undefined) => {
        if(!lastCursor){
            return;
        }
        const response = await handleFetch(filter, lastCursor);
        if(response.status === 200){
            const data = await response.json();
            handleSetResults(data.data, data.hasMore, true);
            setApiStatus("success");
        }else{
            setApiStatus("error");
            setSearchResults([]);
        }
    }
    const debounceFetchMore = debounce(handleFetchMore, 1000);
    const handleResponseFromSearchEndpoints = async (response: Response, callback?:()=>void) => {
            const data = await response.json();
            handleSetResults(data.data, data.hasMore);
            setApiStatus("success");
    }
    const suggestionRenderer = (suggestion: UserInSearch, index: number) => {
        return (
            <div key={index} className={style['suggestion-item']}>
                <UserSearchCard variant={'small'} user={suggestion}/>
            </div>
        )
    }
    const revealFilter = () => {
        const filter = document.querySelector(`.${style.controlGroup}`) as HTMLElement;
        filter.classList.toggle(style['overlay-reveal']);
    }
    useEffect(() => {
        //getCitiesFromLongLat(user?.location?.latitude ?? "", user?.location?.longitude ?? "",'40')
        if(!filterBusy){
            handleInitialSearch();
        }
    }, [filterBusy]);
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
                    <FilterGroup resetSort={resetSort} handleFilterSearch={handleApplyFilter}/>
                    <button onClick={revealFilter} className={style['filter-reveal-btn']}>
                        <IoFilter className="icon"/>
                    </button>
                </div>

            <FriendSearchResultList hasMore={hasMore} initiallyFetched={initiallyFetched} lastCursor={lastTimeStramp} infiniteFetcher={debounceFetchMore}  apiStatus={apiStatus} results={searchResults}/>
            </div>
    )
}