import { useEffect, useState } from 'react'
import style from './find-friends.module.css'
import SearchBar from '../../plugins/search-bar/SearchBar'
import { UserInClient} from './../../../types/User'
import { useSession } from 'next-auth/react';
import FriendSearchResultList from './result-list/FriendSearchResultList';
import { getCitiesFromLongLat } from '../../../libs/geodb';
import SuggestionDropDown from '../../plugins/search-bar/suggestion-drop-down/SuggestionDropDown';
import UserSearchCard from '../../user/user-search-card/UserSearchCard';

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
export default function FindFriends() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState<UserInClient[]>([]); //
    const [searchResults, setSearchResults] = useState<UserInClient[]>([]); //
    const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "success" | "error">("idle"); //
    const {data: session} = useSession();
    const user = session?.user;
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
    } ,1000);
    const handleSearchBarInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }
    const handleFilterResultByNearbyCities = async () => {
        const cities = await getCitiesFromLongLat(user?.location?.latitude ?? "", user?.location?.longitude ?? "",'40');
        
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
    const handleSearchFriends = async (username:string) => {
        try{
            setApiStatus("loading");
            const response = await fetch(`/api/users?username=${username}&fetchFriends=true`,getAPIOptions);
            console.log(response);
            return response;
        }catch(e){
            console.log(e);
            setApiStatus("error");
        }
    }
    const handleOnSearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const response = await handleSearchUsers(searchQuery, user?.username ?? "",SEARCH_LIMIT);
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
        let response = await handleSearchFriends(user?.username ?? "");
        if(response){
            if(response.status === 204){
                response = await handleGetResultsFromNearby();
                if(response && response.status === 204){
                    setApiStatus('idle');
                    return;
                }
            }
            if(response.status === 200){
                handleResponseFromSearchEndpoints(response, handleGetResultsFromNearby);
            }
        }else{
            setApiStatus("error");
            setSearchResults([]);
        }
    }
    const handleResponseFromSearchEndpoints = async (response: Response, callback?:()=>void) => {
      
        if(response.status === 200){
            const data = await response.json();
            setSearchResults(data.data);
            setApiStatus("success");
        } else{
            setApiStatus("error");
            setSearchResults([]);
        }
        
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
                    <SuggestionDropDown apiStatus={apiStatus} suggestions={searchSuggestions} suggestionRenderer={suggestionRenderer} />
                </div>

            </div>

           <FriendSearchResultList apiStatus={apiStatus} results={searchResults}/>
        </div>

    )
}