import React, { useState } from 'react';
import style from './buddy-request-tab-content.module.css';
import { UserInSearch} from '../../../types/User';
import { useSession } from 'next-auth/react';
import { FriendRequest } from '../../../types/FriendRequest';
import FriendSearchResultList from '../find-friends/result-list/FriendSearchResultList';
import { UserFilter } from '../find-friends/FilterContext';

interface BuddyRequestTabContentProps {

}

const BuddyRequestTabContent: React.FC<BuddyRequestTabContentProps> = ({}) => {
    const {data: session} = useSession();
    const account_user = session?.user;
    const [potentialBuddies, setPotentialBuddies] = useState<UserInSearch[]>([]);
    const SEARCH_LIMIT = 10;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [initiallyFetched, setInitiallyFetched] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [lastCursor, setLastCursor] = useState<Date | undefined>(undefined);
    const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const filter:UserFilter = {
        nearbyCities: [],
        featuredWeathers: [],
    }
    return (
        <div className={style['buddy-request-tab-content']}>

        </div>
    );
};

export default BuddyRequestTabContent;