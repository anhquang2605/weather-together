import { useEffect, useState } from 'react'
import style from './find-friends.module.css'
import SearchBar from '../../plugins/search-bar/SearchBar'
import {User} from './../../../types/User'
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
    const [searchResults, setSearchResults] = useState<User[]>([]); //
    const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "success" | "error">("idle"); //
    const debounceSearch = debounce( async() => {
        setApiStatus("loading");
        try {
            const response = await fetch(`/api/user/atlas-search?query=${searchQuery}`);
            const data = await response.json();
            setSearchResults(data);
            setApiStatus("success");
            console.log(data);
        } catch (error) {
            setApiStatus("error");
        }
    } ,1000);
    const handleSearchBarInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }
    useEffect(()=>{
        if(searchQuery.length > 0){
            debounceSearch();
        }else{
            setSearchResults([]);
        }
    },[searchQuery])
        return (
        <div className={style['find-friends']}>
           <SearchBar placeholder='Search for new friends' query={searchQuery} setQuery={handleSearchBarInputChange}/>
        </div>

    )
}