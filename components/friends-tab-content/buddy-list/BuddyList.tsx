import React, { useEffect } from 'react';
import style from './buddy-list.module.css';
import { Buddy, UserInSearch } from '../../../types/User';
import { useSession } from 'next-auth/react';
import BuddiesList from './buddies-list/BuddiesList';

interface BuddyListProps {
    friendUsernames: Set<string>;
}
interface ReponseFromFetchBuddies {
    data: Buddy[];
    hasMore: boolean;
    success: boolean;
}

const BuddyList: React.FC<BuddyListProps> = ({}) => {
    const [lastCursorDate, setLastCursorDate] = React.useState<Date | undefined>();
    const [buddyList, setBuddyList] = React.useState<Buddy[]>([]);
    const [apiStatus, setApiStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [limit, setLimit] = React.useState(10);
    const [hasMore, setHasMore] = React.useState(true);
    const {data: session} = useSession();
    const user = session?.user;
    const handleFetchBuddies = async () => {
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
                params.append('lastCursorDate', typeof lastCursorDate === 'object' ? lastCursorDate.toISOString() : lastCursorDate);
            }
            const response = await fetch(`${path}?${params.toString()}`, options);
            if(response.status === 200){
                return await response.json() as ReponseFromFetchBuddies;
            }else if(response.status === 204){
                return {
                    success: true,
                    hasMore: false,
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
        const response = await handleFetchBuddies();
        if(response && response.success){
            setBuddyList(response.data);
            setHasMore(response.hasMore);
            setApiStatus('success');
        }else{
            setApiStatus('error');
        }
    }
    const handleFetchMoreBuddies = async () => {}
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
    return (
        <div className={style['buddy-list']}>
            <BuddiesList 
                buddies={buddyList}
                hasMore={hasMore}
                fetchMoreBuddies={handleFetchMoreBuddies}
                isFetching={apiStatus === 'loading'}
                apiStatus={apiStatus}
            />
        </div>
    );
};

export default BuddyList;