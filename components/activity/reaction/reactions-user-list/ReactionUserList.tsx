import React, { useEffect, useRef, useState } from 'react';
import style from './reaction-user-list.module.css';
import { ReactionGroup, ReactionWithUser } from '../../../../types/Reaction';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import ReactionCategorizedTabs from './reaction-categorized-tabs/ReactionCategorizedTabs';
import ReactionList from './reaction-list/ReactionList';
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
    const [isFriend, setIsFriend] = useState<string>('true');
    const [apiStatus, setApiStatus] = useState<string>('idle'); //idle, loading, succeeded, failed
    const [fetching, setFetching] = useState<boolean>(false); //idle, loading, succeeded, failed
    const [lastCursor, setLastCursor] = useState<Date>(new Date); 
    const [isLoadedInitially, setIsLoadedInitially] = useState<boolean>(false);
    const [results, setResults] = useState<ReactionWithUser[]>([]); 
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [currentGroup, setCurrentGroup] = useState<string>('all'); //all, like, love, haha, wow, sad, angry
    const [remainToFetch, setRemainToFetch] = useState<number>(0); //will be updated if the first fetch is not enough
    const [endOfList, setEndOfList] = useState<boolean>(false); //will be updated if the first fetch is not enough
    const handleFetchReactionsWithUsers = async (limit: number, replace = false) => {
        setApiStatus('loading');
        setFetching(true);
        const path = '/reactions/get-reactions-with-users';
        const params = {
            targetId: targetId,
            username: username,
            name: currentGroup,
            isFriend,
            limit,
            lastCursor: ( typeof lastCursorRef.current === 'string' ? lastCursorRef.current : lastCursorRef.current?.toISOString() ) || ''
        }
        const response = await fetchFromGetAPI(path, params);
        if(response.success){
            const data = response.data;
            setFetching(false);
            setHasMore(data.hasMore);
            if(replace){
                setResults(data.results);
            }else{
                setResults([...results, ...data.results]);
            }
            if(!data.hasMore && isFriend){//flip to false, happen only once
                let newLimit = LIMIT - data.results.length;
                if(newLimit > 0){
                    setRemainToFetch(newLimit);
                }
                setIsFriend('false');
                params.isFriend = 'false';
                const response2 = await fetchFromGetAPI(path, params);
                if(response2.success){
                    setResults([...data.results, ...response2.data.results]);
                }else {
                    setApiStatus('failed');
                    return;
                }
            }
            setApiStatus('success');
        }else {
            setApiStatus('failed');
        }
    }
    const handleInitialFetch = async () => {
        await handleFetchReactionsWithUsers(LIMIT, true);
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
        if(remainToFetch > 0){
            handleFetchReactionsWithUsers(remainToFetch);
        }
    }, [remainToFetch]);
    useEffect(()=>{

    },[currentGroup])
    return (
        <div className={style['reaction-user-list']}>
            <ReactionCategorizedTabs currentTab={currentGroup} reactionsGroups={reactionGroups} setCurrentTab={setCurrentGroup}/>
            <ReactionList
                results={results}
                setEndOfList={setEndOfList}
                fetching={fetching}
            />

        </div>
    );
};

export default ReactionUserList;