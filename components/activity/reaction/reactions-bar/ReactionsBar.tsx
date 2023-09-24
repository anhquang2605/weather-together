import React, {useEffect, useRef, useState} from 'react';
import { Reaction, ReactionWithUser } from '../../../../types/Reaction';
import style from './reactions-bar.module.css';
import ReactionComponent from '../ReactionComponent';
import { last, set } from 'lodash';
import { useSession } from 'next-auth/react';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';

interface ReactionButtonProps{
    reactionsGroups: {
        name: string;
        count: number;
        usernames: string[];
    }[];
    usernames: string[];
    targetId: string;
}
export default function ReactionsBar( {reactionsGroups, usernames, targetId}: ReactionButtonProps){
    const LIMIT = 10;
    const {data: sesson} = useSession();
    const [isFriend, setIsFriend] = useState<string>('true');
    const [apiStatus, setApiStatus] = useState<string>('idle'); //idle, loading, succeeded, failed
    const [fetching, setFetching] = useState<boolean>(false); //idle, loading, succeeded, failed
    const [lastCursor, setLastCursor] = useState<Date>(new Date); 
    const [results, setResults] = useState<ReactionWithUser[]>([]); 
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [remainToFetch, setRemainToFetch] = useState<number>(0); //TODO: change to 10
    const lastCursorRef = useRef<Date | null>(null);
    const user = sesson?.user;
    const myUsername = user?.username || '';
    const totalCount = reactionsGroups.reduce((acc, curr) => {
        return acc + curr.count;
    }, 0);
    const handleFetchReactionsWithUsers = async (limit: number) => {
        setApiStatus('loading');
        setFetching(true);
        const path = '/api/reactions/get-reactions-with-users';
        const params = {
            targetId: targetId,
            username: myUsername,
            isFriend,
            limit,
            lastCursor: ( typeof lastCursorRef.current === 'string' ? lastCursorRef.current : lastCursorRef.current?.toISOString() ) || ''
        }
        const response = await fetchFromGetAPI(path, params);
        if(response){
            setApiStatus('succeeded');
            setFetching(false);
            setHasMore(response.hasMore);
            setResults(response.results);
        }
    }
    const handleInitialFetch = async () => {
        await handleFetchReactionsWithUsers(LIMIT);
    }
    useEffect(()=>{
        handleInitialFetch();
    },[])
    useEffect(()=>{
        if(!hasMore && isFriend){
            let limit = LIMIT - results.length;
            if(limit > 0){
                setRemainToFetch(limit);
            }
            setIsFriend('false');
        }
    }, [results, hasMore])
    useEffect(()=>{
        if(results.length > 0){
            setLastCursor(results[results.length - 1].createdDate);
        }
        console.log(results);
    },[results])
    useEffect(()=>{
        lastCursorRef.current = lastCursor;
    }, [lastCursor])
    useEffect(()=>{
        if(remainToFetch > 0){
            handleFetchReactionsWithUsers(remainToFetch);
        }
    }, [remainToFetch]);
    return (
        <div className={style['reactions-bar']}>
            {
                totalCount > 0 ?
                <>
                    <div className={style['reactions-bar__title']}>
                        {totalCount} Reactions
                    </div>
                    <div className={style["target-reactions-group-names"]}>
                        {reactionsGroups.map((reactionGroup) => {
                            return(
                                <ReactionComponent key={reactionGroup.name} name={reactionGroup.name}/>
                            )
                        })}  
                    </div>
                </>
                :
                <div className={style['reactions-bar__title']}>
                    Be the first to react
                </div>
            }
            

        </div>
    )
}
/* 
    1.Fetch all users from usernames, each user will be associated with a reaction
      - create agregation, reactions will be paired with a user
      _ after this, check if user are with the curernt user?
    1. If reacted User are friend, displayed at the top:
        _How to check if user are friend?
        _sorted by reaction time descent
    2. If reacted User are not friend, displayed at the bottom:

*/