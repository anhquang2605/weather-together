import React, { useEffect, useRef, useState } from 'react';
import style from './reaction-user-list.module.css';
import { ReactionGroup, ReactionWithUser } from '../../../../types/Reaction';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import ReactionCategorizedTabs from './reaction-categorized-tabs/ReactionCategorizedTabs';
import ReactionList from './reaction-list/ReactionList';
import { init } from 'next/dist/compiled/@vercel/og/satori';
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
    const LIMIT = 10;
    const lastCursorRef = useRef<Date | null>(null);
    const [formReset, setFormReset] = useState<boolean>(false);
    const [isFriend, setIsFriend] = useState<string>('true');
    const [apiStatus, setApiStatus] = useState<string>('idle'); //idle, loading, succeeded, failed
    const [fetchingStatus, setFetchingStatus] = useState<string>('idle'); //idle, loading, succeeded, failed
    const [lastCursor, setLastCursor] = useState<Date>(new Date); 
    const [isLoadedInitially, setIsLoadedInitially] = useState<boolean>(false);
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
                setResults([...results, ...data.results]);
            }
            if(!data.hasMore && isFriend){//flip to false, happen only once
                let newLimit = LIMIT - data.results.length;
                if(newLimit > 0){
                   params.limit = newLimit;
                }
                setIsFriend('false');
                params.isFriend = 'false';
                const response2 = await fetchFromGetAPI(path, params);
                if(response2.success){
                    setResults([...data.results, ...response2.data.results]);
                }else {
                    setApiStatus('failed');
                    return false;
                }
            }
            setFormReset(false);
            return true;
        }else {
            return false
        }
    }
    const handleReset = () => {
        setResults([]);
        setLastCursor(new Date);
        setHasMore(true);
        setIsFriend('true');
        setIsLoadedInitially(false);
        setFormReset(true);
    }
    const handleInitialFetch = async () => {
        setApiStatus('loading');
        const success = await handleFetchReactionsWithUsers(LIMIT, true);
        if(success){
            setApiStatus('success');
            setIsLoadedInitially(true);
        }else{
            setApiStatus('failed');
        }

    }
    const handleFetchMore = async () => {
        if(!hasMore || fetchingStatus === 'loading'){
            return;
        }
        setFetchingStatus('loading');
        const success = await handleFetchReactionsWithUsers(LIMIT);
        if(success){
            setFetchingStatus('success');
        }else{
            setFetchingStatus('failed');
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
        handleReset();
    },[currentGroup])
    useEffect(()=>{
        if(formReset){
            handleInitialFetch();
        }
    },[formReset])
    return (
        <div className={style['reaction-user-list']}>
            <ReactionCategorizedTabs currentTab={currentGroup} reactionsGroups={reactionGroups} setCurrentTab={setCurrentGroup}/>
            <ReactionList
                results={results}
                setEndOfList={setEndOfList}
                fetchingStatus={fetchingStatus}
            />

        </div>
    );
};

export default ReactionUserList;