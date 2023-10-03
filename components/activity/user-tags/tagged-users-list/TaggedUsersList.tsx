import React, { useEffect } from 'react';
import style from './tagged-users-list.module.css';
import { UserWithFriendStatus } from '../../../../types/User';
import { insertToPostAPI } from '../../../../libs/api-interactions';
import LoadingIndicator from '../../../loading-indicator/LoadingIndicator';
import UserProfileBar from '../../../user/user-profile-bar/UserProfileBar';

interface TaggedUserListProps {
    usernames: string[];
    username: string;
    
}

const TaggedUserList: React.FC<TaggedUserListProps> = ({
    usernames,
    username,

}) => {
    const [fetchStatus, setFetchStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [endOflist, setEndOfList] = React.useState<boolean>(false); // if true, then no more users to fetch
    const [fetchInitially, setFetchInitially] = React.useState<boolean>(false);
    const [fetchedResult, setFetchedResult] = React.useState<UserWithFriendStatus[]>([]);
    const [curPage, setCurPage] = React.useState<number>(1);
    const limit = 5;
    const handleFetchTaggedUsers = async () => {
        const path = 'user/user-friend-status';
        const body = {
            usernames: usernames.slice((curPage - 1) * limit, curPage * limit),
            username
        }
        console.log(usernames.slice((curPage - 1) * limit, curPage * limit));
        const response = await insertToPostAPI(path, body);
        if(response.success){
            return response.data;
        }else{
            return null;
        }
    }
    const handleInitialFetch = async () => {
        const users = await handleFetchTaggedUsers();
        if(users){
            setFetchInitially(true);
            setFetchedResult(users);
            setCurPage(prev => prev + 1);
        }else{
            setFetchInitially(false);
        }
    }
    const handleFetchMore = async () => {
        setFetchStatus('loading');
        const users = await handleFetchTaggedUsers();
        if(users){
            setFetchStatus('success');
            setCurPage(prev => prev + 1);
            setFetchedResult(prev => [...prev, ...users]);
            setEndOfList(false);// list is filled again, so flip the flag
        }else{
            setFetchStatus('error');
        }
    }
    const handleOnIntersection = (entries: IntersectionObserverEntry[]) => {
        if(entries[0].isIntersecting){
            setEndOfList(true);
        }
    };
    useEffect(()=>{
        if(!fetchInitially){
            handleInitialFetch();
        }
    },[])
    useEffect(()=>{
        if(fetchInitially){
            const option = {
                root: document.querySelector('.' + style['tagged-users-list']),
            }
            const observer = new IntersectionObserver(handleOnIntersection, option);
            const target = document.querySelector('.' + style['lazy-target']);
            if(target){
                observer.observe(target);
            }
            return () => {
                observer.disconnect();
            }
        }
    },[fetchInitially])
    useEffect(()=>{
        if(endOflist && fetchedResult.length < usernames.length){
            handleFetchMore();
        }
    },[endOflist])
    return (
        fetchInitially ? 
        <div className={style['tagged-users-list']}>
            {
                fetchedResult && fetchedResult.map((user, index) => {
                    return <UserProfileBar 
                    key={index}
                    user= {user}
                    last={index === fetchedResult.length - 1}
                    />
                })
            }
            <div className={style['lazy-target'] + " " + (fetchStatus === 'loading' && style['fetching'])}>
                {<LoadingIndicator fluid = {true}/>}
            </div>
            {
                fetchStatus === 'error' && <div className={style['error-fetching']}>Error fetching users</div>
            }
        </div> : 
        <LoadingIndicator/>
    );
};

export default TaggedUserList;