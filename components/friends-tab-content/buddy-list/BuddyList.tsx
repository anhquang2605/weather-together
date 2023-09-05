import React, { useEffect } from 'react';
import style from './buddy-list.module.css';
import { Buddy, UserInSearch } from '../../../types/User';
import { useSession } from 'next-auth/react';
import BuddiesList from './buddies-list/BuddiesList';
import SearchBar from '../../plugins/search-bar/SearchBar';

interface BuddyListProps {
    friendUsernames: Set<string>;
}
interface ReponseFromFetchBuddies {
    data: Buddy[];
    hasMore: boolean;
    success: boolean;
    counts: number;
}

const BuddyList: React.FC<BuddyListProps> = ({}) => {
    const [lastCursorDate, setLastCursorDate] = React.useState<Date | undefined>();
    const [buddyList, setBuddyList] = React.useState<Buddy[]>([]);
    const [apiStatus, setApiStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [isFetching, setIsFetching] = React.useState(false);
    const [limit, setLimit] = React.useState(4);
    const [hasMore, setHasMore] = React.useState(true);
    const [counts, setCounts] = React.useState(0)
    const {data: session} = useSession();
    const user = session?.user;
    const [searchTerm, setSearchTerm] = React.useState('');
    const handleFetchBuddies = async (lastCursorDate?: Date) => {
        try{
            const path = '/api/buddies';
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const params = new URLSearchParams({
                limit: limit.toString(),
                username: user?.username || '',
            })

            if(lastCursorDate){
                params.append('lastCursor', typeof lastCursorDate === 'object' ? lastCursorDate.toISOString() : lastCursorDate);
            }
            if(searchTerm && searchTerm.length > 0){
                params.append('searchTerm', searchTerm);
            }
            console.log(params.toString());
            const response = await fetch(`${path}?${params.toString()}`, options);
            if(response.status === 200){
                return await response.json() as ReponseFromFetchBuddies;
            }else if(response.status === 204){
                return {
                    success: true,
                    hasMore: false,
                    counts: 0,
                    data: []
                } as ReponseFromFetchBuddies;
            }
        }catch(e){
            console.log(e);
            setApiStatus('error');
        }
    }
    const handleInitalFetchBuddies = async () => {
        setApiStatus('loading');
        const response = await handleFetchBuddies(lastCursorDate);
        if(response && response.success){
            handleSetResults(response);
            setApiStatus('success');
        }else{
            setApiStatus('error');
        }
    }
    const handleChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }
    const handleSetResults = (response: ReponseFromFetchBuddies) => {
        setBuddyList(response.data);
        setHasMore(response.hasMore);
        setCounts(response.counts);
    }
    const handleSearchBuddies = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
        const response = await handleFetchBuddies();
        if(response && response.success){
            handleSetResults(response);
            setApiStatus('success');
        }else{
            setApiStatus('error');
        }
    }
    const handleFetchMoreBuddies = async (lastCursor: Date | undefined) => {
        setIsFetching(true);
        const response = await handleFetchBuddies(lastCursor);
        if(response && response.success){
            setBuddyList([...buddyList, ...response.data]);
            setHasMore(response.hasMore);
            setCounts(response.counts);
            setIsFetching(false);
        } else {
            setIsFetching(false);
            setApiStatus('error');
        }
    }
    useEffect(()=>{
        if(user){
            handleInitalFetchBuddies();
        }
    },[user])
    useEffect(() => {
        if(buddyList.length > 0){
            setLastCursorDate(buddyList[buddyList.length - 1].since);
        }
    }, [buddyList]);
    useEffect(()=> {
        console.log(lastCursorDate);
    },[lastCursorDate])
    return (
        <div className={style['buddy-list']}>
            <div className={style['search']}>
                <SearchBar 
                    placeholder="Search buddies"
                    query={searchTerm}
                    setQuery={handleChangeSearchTerm}
                    onSearch={handleSearchBuddies}
                    variant={'bordered'}
                />
            </div>

            <BuddiesList 
                buddies={buddyList}
                hasMore={hasMore}
                fetchMoreBuddies={handleFetchMoreBuddies}
                isFetching={isFetching}
                apiStatus={apiStatus}
                counts={counts}
                lastCursorDate={lastCursorDate}
            />
        </div>
    );
};

export default BuddyList;