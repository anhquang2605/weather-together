import React, { useEffect, useRef, useState } from 'react';
import style from './buddy-tag-form.module.css';
import {IoReturnUpBack} from 'react-icons/io5'
import SearchBar from '../../../../plugins/search-bar/SearchBar';
import useLazyFetch from '../../../../../hooks/lazy-fetch/useLazyFetch';
import { Buddy } from '../../../../../types/User';
import { debounce, last, set } from 'lodash';
import { BuddyFetchResponse, BuddyParams } from '../../../../../pages/api/buddies';
import BuddyTagResult from './buddy-tag-result/BuddyTagResult';
import { useViewSliderContext } from '../../../../plugins/view-slider/useViewSliderContext';
import { usePostFormContext } from '../../post-engagement/usePostFormContext';
import TaggedUserCloud from '../../../../widgets/tagged-user-cloud/TaggedUserCloud';
interface BuddyTagFormProps {
    username: string;
}


const FriendTagForm: React.FC<BuddyTagFormProps> = ({username}) => {
    const taggedUsernames = usePostFormContext().getTaggedUsernames();
    const {taggedUserClouds} = usePostFormContext();
    const [action, setAction] = useState<string>("search"); // action to perform on the buddy list [add, remove
    const curUsername = useRef<string>(username);
    const {setActiveSlide} = useViewSliderContext();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [fetchingMore, setFetchingMore] = useState<boolean>(false); // whether the app is fetching more buddies
    const [searchResult,  setSearchResult] = useState<Buddy[]>([]); //
    const [hasMore, setHasMore] = useState<boolean>(true); // whether there are more buddies to fetch
    const [counts, setCounts] = useState<number>(0); // total number of buddies that match the search term
    const  [fetchState, fetchData] = useLazyFetch<BuddyFetchResponse>();
    const [lastCursor, setLastCursor] = useState<Date | undefined>(); // last cursor of the last fetched page
    const lastCursorRef = React.useRef<Date | undefined>(lastCursor);
    //remember to useRef on the last cursor
    const BUDDY_URL_API = '/api/buddies';
    const LIMIT = 7;
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
            username: curUsername.current,
            searchTerm,
            limit: LIMIT.toString(),
            lastCursor: lastCursorRef.current? (
                typeof lastCursorRef.current === 'string' ? lastCursorRef.current : lastCursorRef.current.toISOString()
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
    const debouncedFetch = debounce(handleFetch, 500);
    const handleAutocompleteSearch = () => {
        lastCursorRef.current = undefined;
        setAction('search');
        debouncedFetch();

    }
    const handleFetchMore = () => {
        setFetchingMore(true);
        setAction('fetch');
        debouncedFetch();
    }
    const initialSearch = () => {
        setAction('search');
        debouncedFetch();
    }
    useEffect(()=>{
        if(username.length){
            username.length && initialSearch();
            curUsername.current = username;
        }
    },[username])
    useEffect(()=>{
        const {data} = fetchState;
        if(data && data.data.length > 0){
            const buddies = data.data;
            if(action === 'search'){
                setSearchResult(buddies);
            } else {
                setSearchResult(
                    prev => [...prev, ...buddies]);
            }
            setHasMore(data.hasMore);
            setCounts(data.counts);
            setLastCursor(data.data[data.data.length-1].since);
            setFetchingMore(false);
        }
    },[fetchState])
    useEffect(()=>{
            handleAutocompleteSearch();
    },[searchTerm])
/*     useEffect(()=> {
    //INFINITE STATE UPDATE HERE BE WARY
        if(taggedUsernames.length > 0){
            const filteredResult = searchResult.filter((buddy) => {
                return !taggedUsernames.includes(buddy.friendUsername);
            })
            setSearchResult(filteredResult);
        }
    },[taggedUsernames]) */
    useEffect(()=>{
        lastCursorRef.current = lastCursor;
    },[lastCursor])
    return (
        <div className={style['buddy-tag-form']}>
            <button className="flex flex-row items-center" onClick={()=>{
            setActiveSlide(0);
            }}>
                    <IoReturnUpBack className="w-8 h-8 mr-2"/>
            </button>
            <div className="my-8">
                <SearchBar
                    query={searchTerm}
                    setQuery={handleSetTerm}
                    placeholder='Search for buddies'
                    onSearch={()=>{}}
                    variant="bordered"
                    autoCompleteSearch={true}
                />
            </div>
            <TaggedUserCloud 
                items={taggedUserClouds}
                removeItem={usePostFormContext().removeTaggedUsername}
            />
            <div className="w-full relative">

                <BuddyTagResult
                        fetchMore={handleFetchMore}
                        hasMore={hasMore}
                        results={searchResult}
                        fetchingMore={fetchingMore}
                        counts={counts}
                />
            </div>

        </div>
    );
};

export default FriendTagForm;