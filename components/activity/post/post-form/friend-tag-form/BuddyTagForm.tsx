import React, { useEffect, useState } from 'react';
import style from './buddy-tag-form.module.css';
import {IoReturnUpBack} from 'react-icons/io5'
import SearchBar from '../../../../plugins/search-bar/SearchBar';
import useLazyFetch from '../../../../../hooks/lazy-fetch/useLazyFetch';
import { Buddy } from '../../../../../types/User';
import { debounce } from 'lodash';
import { BuddyFetchResponse, BuddyParams } from '../../../../../pages/api/buddies';
interface BuddyTagFormProps {
    addBuddyTag: (buddyUsername: string) => void;
    removeBuddyTag: (buddyUsername: string) => void;
    username: string;
}


const FriendTagForm: React.FC<BuddyTagFormProps> = ({addBuddyTag,removeBuddyTag,username}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResult,  setSearchResult] = useState<Buddy[]>([]); //
    const [hasMore, setHasMore] = useState<boolean>(true); // whether there are more buddies to fetch
    const [counts, setCounts] = useState<number>(0); // total number of buddies that match the search term
    const  [fetchState, fetchData] = useLazyFetch<BuddyFetchResponse>();
    const [lastCursor, setLastCursor] = useState<Date>(); // last cursor of the last fetched page
    //remember to useRef on the last cursor
    const BUDDY_URL_API = '/api/buddies';
    const LIMIT = 10;
    const handleSetTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }
    
    const handleFetch = async () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const params = {
            username,
            searchTerm,
            limit: LIMIT.toString(),
            lastCursor: lastCursor? (
                typeof lastCursor === 'string' ? lastCursor : lastCursor.toISOString()
            ) : new Date().toISOString()
        }
        let urltoFetch = BUDDY_URL_API + '?' + new URLSearchParams(params).toString();
        try{
            await fetchData(urltoFetch,options);

        } catch (err) {
            console.log(
                'error fetching buddies'
            )
        }



    }
    const debouncedFetch = debounce(handleFetch, 300);
    const handleAutocompleteSearch = () => {
        debouncedFetch();
    }
    const handleOnSearch = () => {

    }
    const initialSearch = () => {
        
    }
    useEffect(()=>{

    },[])
    useEffect(()=>{
        const {data} = fetchState;
        if(data && data.data.length > 0){
            const buddies = data.data;
            setSearchResult(buddies);
            setHasMore(data.hasMore);
            setCounts(data.counts);
            console.log(buddies, hasMore, counts);
        }
    },[fetchState])
    useEffect(()=>{
        if(searchTerm.length > 0){
            handleAutocompleteSearch();
        }
    },[searchTerm])
    return (
        <div className={style['buddy-tag-form']}>
            <button className="flex flex-row items-center" onClick={()=>{

            }}>
                    <IoReturnUpBack className="w-8 h-8 mr-2"/>
            </button>
            <div className="my-4">
                <SearchBar
                    query={searchTerm}
                    setQuery={handleSetTerm}
                    placeholder='Search for buddies'
                    onSearch={handleOnSearch}
                    variant="bordered"
                    autoCompleteSearch={true}
                />
            </div>
           
        </div>
    );
};

export default FriendTagForm;