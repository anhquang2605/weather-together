import React from 'react';
import style from './buddies-list.module.css';
import { Buddy } from '../../../../types/User';
import BuddyCard from './buddy-card/BuddyCard';

interface BuddiesListProps {
    buddies: Buddy[];
    hasMore: boolean;
    fetchMoreBuddies: () => void;
    isFetching: boolean;
    apiStatus: 'idle' | 'loading' | 'success' | 'error';    
}

const BuddiesList: React.FC<BuddiesListProps> = (props) => {
    const {buddies, hasMore, fetchMoreBuddies, isFetching, apiStatus} = props;
    
    return (
        <div className={style['list-container']}>
              <div className={style['buddies-list']}>
            {
                buddies.map( (buddy, index) => {
                    return (
                        <BuddyCard
                            key={index}
                            buddy={buddy}
                        />
                    )
                })
            }
        </div>
        </div>
      
    );
};

export default BuddiesList;