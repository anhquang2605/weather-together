import { useState } from 'react'
import style from './find-friends.module.css'
import SearchBar from '../../plugins/search-bar/SearchBar'
import {User} from './../../../types/User'
export default function FindFriends() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]); //
    const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "success" | "error">("idle"); //
    const handleSearchBarInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);

    }
    
        return (
        <div className={style['find-friends']}>
           <SearchBar placeholder='Search for new friends' query={searchQuery} setQuery={handleSearchBarInputChange}/>
        </div>

    )
}