import React, { use, useEffect, useRef, useState } from 'react';
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
import TaggedUserCloud from '../../../../widgets/tagged-user-cloud/TaggedBuddy';
import TaggedBuddy from '../../../../widgets/tagged-user-cloud/TaggedBuddy';
import { mergeAndSortUniqueArrays } from '../../../../../utils/arrays';
interface BuddyTagFormProps {
    username: string;
}
export interface BuddyTag extends Buddy{
    tagged?: boolean;
    animated?: boolean;
}

const FriendTagForm: React.FC<BuddyTagFormProps> = ({username}) => {
    const taggedUsernames = usePostFormContext().getTaggedUsernames();
    const {taggedBuddys, lastItemRemoved, lastItemAdded, addTimestamp, removeimestamp} = usePostFormContext();
    const [action, setAction] = useState<string>("search"); // action to perform on the buddy list [add, remove
    const curUsername = useRef<string>(username);
    const {setActiveSlide} = useViewSliderContext();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [fetchingMore, setFetchingMore] = useState<boolean>(false); // whether the app is fetching more buddies
    const [searchResult,  setSearchResult] = useState<BuddyTag[]>([]); //
    const [hasMore, setHasMore] = useState<boolean>(true); // whether there are more buddies to fetch
    const [counts, setCounts] = useState<number>(0); // total number of buddies that match the search term
    const  [fetchState, fetchData] = useLazyFetch<BuddyFetchResponse>();
    const [lastCursor, setLastCursor] = useState<Date | undefined>(); // last cursor of the last fetched page
    const lastCursorRef = React.useRef<Date | undefined>(lastCursor);
    //remember to useRef on the last cursor
    const BUDDY_URL_API = '/api/buddies';
    const LIMIT = 8;
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
    const getTimeFromSince = (since: Date) => {
        return new Date(since).getTime();
    }
    const compareBuddiesBySince = (a: BuddyTag, b: BuddyTag) => {
        const aSince = getTimeFromSince(a.since);
        const bSince = getTimeFromSince(b.since);
        return bSince - aSince;
    }
    const getTimeFromBuddy = (buddy: BuddyTag) => {
        return new Date(buddy.since).getTime();
    }
    const handleSetResult = () => {
        const {data} = fetchState;
        let lastFromMergedResult: Date | undefined;
        if(data && data.data.length > 0){
            const buddies = data.data;
            if(action === 'search'){
                if(taggedUsernames.length > 0){
                    const oldTags = new Set(taggedBuddys);
                    const mergedResult = mergeAndSortUniqueArrays(oldTags, buddies, compareBuddiesBySince, getTimeFromBuddy);
                    setSearchResult(mergedResult);
                    lastFromMergedResult = mergedResult[mergedResult.length - 1].since;
                }else {
                    setSearchResult(buddies);
                }
            } else {
                setSearchResult(
                    prev => [...prev, ...buddies]);
            }
            setHasMore(data.hasMore);
            setCounts(data.counts);
            setLastCursor(lastFromMergedResult ? lastFromMergedResult : data.data[data.data.length-1].since);
            setFetchingMore(false);
        }
    }
    //UTILS

    useEffect(()=>{
        if(username.length && taggedUsernames.length === 0){
            username.length && initialSearch();
            curUsername.current = username;
        }else {
            
        }
    },[username])
    useEffect(()=>{
       handleSetResult();
    },[fetchState])
    useEffect(()=>{
            handleAutocompleteSearch();
    },[searchTerm])
    useEffect(()=>{
        if(lastItemRemoved){
            const newResult = [...searchResult];
            const index = newResult.findIndex((buddy) => buddy.friendUsername === lastItemRemoved);
            if(index !== -1){
                newResult[index].tagged = false;
                setSearchResult(newResult);
            }
        }
    },[removeimestamp])
    useEffect(()=>{
        if(lastItemAdded){
            const newResult = [...searchResult];
            const index = newResult.findIndex((buddy) => buddy.friendUsername === lastItemAdded);
            if(index !== -1){
                newResult[index].tagged = true;
                newResult[index].animated = true;
                setSearchResult(newResult);
            }
        }
    },[addTimestamp])
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
            <TaggedBuddy
                items={taggedBuddys}
                removeItem={usePostFormContext().removeTaggedUsername}
            />
            <div className="w-full relative">

                {taggedUsernames.length !== searchResult.length && <BuddyTagResult
                        fetchMore={handleFetchMore}
                        hasMore={hasMore}
                        results={searchResult}
                        fetchingMore={fetchingMore}
                        counts={counts}
                />}
            </div>

        </div>
    );
};

export default FriendTagForm;