import React, { useEffect, useRef, useState } from 'react';
import style from './reaction-user-list.module.css';
import { ReactionGroup, ReactionWithUser } from '../../../../types/Reaction';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import ReactionCategorizedTabs from './reaction-categorized-tabs/ReactionCategorizedTabs';
import ReactionList from './reaction-list/ReactionList';
import LoadingIndicator from '../../../loading-indicator/LoadingIndicator';
import { set } from 'lodash';
import { is } from 'date-fns/locale';

interface ReactionUserListProps {
    targetId: string;
    username: string;
    reactionGroups: ReactionGroup[];
}

const ReactionUserList: React.FC<ReactionUserListProps> = ({
    targetId,
    username,
    reactionGroups
}) => {
    const LIMIT = 5;
    const lastCursorRef = useRef<Date | null>(null);
    const [formReset, setFormReset] = useState<boolean>(false);
    const [isFriend, setIsFriend] = useState<string>('true');
    const [apiStatus, setApiStatus] = useState<string>('idle'); //idle, loading, succeeded, failed
    const [fetchingStatus, setFetchingStatus] = useState<string>('idle'); //idle, loading, succeeded, failed
    const [lastCursor, setLastCursor] = useState<Date>(new Date); 
    const [isLoadedInitially, setIsLoadedInitially] = useState<boolean>(false);
    const [initialFetchStatus, setInitialFetchStatus] = useState<string>('idle'); //idle, loading, succeeded, failed
    const [results, setResults] = useState<ReactionWithUser[]>([]); 
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [currentGroup, setCurrentGroup] = useState<string>('all'); //all, like, love, haha, wow, sad, angry
    const [endOfList, setEndOfList] = useState<boolean>(false); //will be updated if the first fetch is not enough
    const handleFetchReactionsWithUsers = async (limit: number, replace = false) => {
        const path = '/reactions/get-reactions-with-users';
        const params = {
            targetId: targetId,
            username: username,
            name: currentGroup,
            isFriend: isFriend,//
            limit,
            lastCursor: replace === false ? (( typeof lastCursorRef.current === 'string' ? lastCursorRef.current : lastCursorRef.current?.toISOString() ) || '') : new Date().toISOString()
        }

        const response = await fetchFromGetAPI(path, params);

        if(response.success){
            const data = response.data;

            setHasMore(data.hasMore);
            if(replace){
                setResults(data.results);
            }else{
                setResults( prev => 
                    [...prev, ...data.results]);
            }
            if(!data.hasMore && isFriend === "true"){//flip to false, happen only once, this is when the first fetch is not enough to fill the list
                let newLimit = LIMIT - data.results.length;
                if(newLimit > 0){
                   params.limit = newLimit;
                }
                setIsFriend('false');
                params.lastCursor = new Date().toISOString();
                params.isFriend = 'false';
                const response2 = await fetchFromGetAPI(path, params);

                if(response2.success){
                    setResults(prev => [...prev, ...response2.data.results]);
                    setHasMore(response2.data.hasMore);
                }else {
                    setApiStatus('failed');
                }
            }
            setFormReset(false);
            return true;
        }else {
            //faled to fetch with true, try with false
            if(isFriend === "true" && !isLoadedInitially){
                params.isFriend = 'false';
                const response2 = await fetchFromGetAPI(path, params);
                if(response2.success){
                    setResults(prev => [...prev, ...response2.data.results]);
                    setHasMore(response2.data.hasMore);
                    setFormReset(false);
                    return true;
                }
            }
            setApiStatus('failed');
            return false
        }
    };
    const handleReset = () => {
        setResults([]);
        setLastCursor(new Date);
        setHasMore(true);
        setIsFriend('true');
        setIsLoadedInitially(false);
        setEndOfList(false);
        setFormReset(true);
        setInitialFetchStatus('idle');
    }
    const handleInitialFetch = async () => {
        setInitialFetchStatus('loading');
        const success = await handleFetchReactionsWithUsers(LIMIT, true);
        if(success){
            setInitialFetchStatus('success');
            setIsLoadedInitially(true);
        }else{
            setInitialFetchStatus('failed');
            setIsLoadedInitially(false);
        }

    }
    const handleFetchMore = async () => {
        if(isLoadedInitially && hasMore && fetchingStatus !== 'loading' && apiStatus !== 'loading'){
            setFetchingStatus('loading');
            const success = await handleFetchReactionsWithUsers(LIMIT);
            if(success){
                setFetchingStatus('success');
                setEndOfList(false);
            }else{
                setFetchingStatus('failed');
            }
        }
    }
    useEffect(()=>{
        handleInitialFetch();
    },[])
    
    useEffect(()=>{
        if(results && results.length > 0){
            setLastCursor(results[results.length - 1].createdDate);
        }
    },[results])
    useEffect(()=>{
        lastCursorRef.current = lastCursor;
    }, [lastCursor])
    useEffect(()=>{
        if(isLoadedInitially){
            handleReset();
        }
    },[currentGroup])
    useEffect(()=>{
        if(formReset){
            handleInitialFetch();
        }
    },[formReset])
    useEffect(()=>{
        if(endOfList ){
            handleFetchMore();
        }
    },[endOfList])
    return (
        <div className={style['reaction-user-list']}>
            <ReactionCategorizedTabs currentTab={currentGroup} reactionsGroups={reactionGroups} setCurrentTab={setCurrentGroup}/>
            {initialFetchStatus === 'success' &&
            <ReactionList
                isLoaded={isLoadedInitially}
                results={results}
                setEndOfList={setEndOfList}
                fetchingStatus={fetchingStatus}
            />}
            {
                initialFetchStatus === "loading" &&<LoadingIndicator />
            }
            {
                initialFetchStatus === 'failed' && <div className="text-red-500">Failed to fetch more reactions</div>
            }
        </div>
    );
};

export default ReactionUserList;