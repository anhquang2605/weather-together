import { useEffect, useState } from 'react'
import style from './find-friends.module.css'
import SearchBar from '../../plugins/search-bar/SearchBar'
import { UserInClient} from './../../../types/User'
import { useSession } from 'next-auth/react';
import FriendSearchResultList from './result-list/FriendSearchResultList';
import { getCitiesFromLongLat } from '../../../libs/geodb';

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
    const [searchResults, setSearchResults] = useState<UserInClient[]>([]); //
    const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "success" | "error">("idle"); //
    const {data: session} = useSession();
    const user = session?.user;
    const debounceSearch = debounce( async() => {
        setApiStatus("loading");
        try {
            const response = await fetch(`/api/user/atlas-search?query=${searchQuery}&username=${user?.username}`);
            if(response.ok){
                const data = await response.json();
                setSearchResults(data.data);
                setApiStatus("success");
            }
        } catch (error) {
            setApiStatus("error");
        }
    } ,1000);
    const handleSearchBarInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }
    const handleFilterResultByNearbyCities = async () => {
        const cities = await getCitiesFromLongLat(user?.location?.latitude ?? "", user?.location?.longitude ?? "",'40');
        
    }
    useEffect(() => {
        getCitiesFromLongLat(user?.location?.latitude ?? "", user?.location?.longitude ?? "",'40')
    }, []);
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
           <FriendSearchResultList results={searchResults}/>
        </div>

    )
}