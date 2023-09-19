import React, { useEffect, useState } from 'react';
import style from './buddy-tag-form.module.css';
import {IoReturnUpBack} from 'react-icons/io5'
import SearchBar from '../../../../plugins/search-bar/SearchBar';
import useLazyFetch from '../../../../../hooks/lazy-fetch/useLazyFetch';
import { Buddy } from '../../../../../types/User';
import { debounce, set } from 'lodash';
import { BuddyFetchResponse, BuddyParams } from '../../../../../pages/api/buddies';
import BuddyTagResult from './buddy-tag-result/BuddyTagResult';
import { useViewSliderContext } from '../../../../plugins/view-slider/useViewSliderContext';
import { usePostFormContext } from '../../post-engagement/usePostFormContext';
interface BuddyTagFormProps {
    username: string;
}


const FriendTagForm: React.FC<BuddyTagFormProps> = ({username}) => {
    const {taggedUsernames} = usePostFormContext();
    const {setActiveSlide} = useViewSliderContext();
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
        debouncedFetch();
    }
    useEffect(()=>{
        initialSearch();
    },[])
    useEffect(()=>{
        const {data} = fetchState;
        if(data && data.data.length > 0){
            const buddies = data.data;
            setSearchResult(buddies);
            setHasMore(data.hasMore);
            setCounts(data.counts);
            setLastCursor(data.data[data.data.length-1].since);
        }
    },[fetchState])
    useEffect(()=>{
        if(searchTerm.length > 0){
            handleAutocompleteSearch();
        }
    },[searchTerm])
    useEffect(()=> {
        if(taggedUsernames.size > 0){
            const usernames = Array.from(taggedUsernames);
            const filteredResult = searchResult.filter((buddy) => {
                return !usernames.includes(buddy.friendUsername);
            })
            setSearchResult(filteredResult);
        }
    },[taggedUsernames])
    return (
        <div className={style['buddy-tag-form']}>
            <button className="flex flex-row items-center" onClick={()=>{
            setActiveSlide(0);
            }}>
                    <IoReturnUpBack className="w-8 h-8 mr-2"/>
            </button>
            <div className="mt-4">
                <SearchBar
                    query={searchTerm}
                    setQuery={handleSetTerm}
                    placeholder='Search for buddies'
                    onSearch={handleOnSearch}
                    variant="bordered"
                    autoCompleteSearch={true}
                />
            </div>
            <BuddyTagResult
                    results={searchResult}
            />
        </div>
    );
};

export default FriendTagForm;