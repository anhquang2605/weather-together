import React from 'react';
import style from './feed-title-group.module.css';
import { Feed } from '../../../../types/Feed';
import FeedTitle from '../feed-title/FeedTitle';
import { useSession } from 'next-auth/react';
import { useFeedContext } from '../FeedsContext';

interface FeedTitleGroupProps {
    feeds: Feed[];
}

const FeedTitleGroup: React.FC<FeedTitleGroupProps> = ({feeds}) => {
    const {data: session} = useSession();
    const myUsername = session?.user?.username || "";
    const {usernameToBasicProfileMap} = useFeedContext(); 
    return (
        <div className={style['feed-title-group'] + " glass rounded-lg border border-slate-400 border-b-0"}>
            {
                feeds.length > 1 &&
                <span className={style['feed-group-description']}>
                    {feeds.length} Activities
                </span>
            }

            {
                feeds && feeds.length > 0 &&
                feeds.map((feed,index)=>{
                    return(
                        <FeedTitle 
                            key={index}
                            feed={feed}
                            usernameToBasicProfileMap={usernameToBasicProfileMap}
                            myUsername={myUsername}
                        />
                    )
                })
            }
        </div>
    );
};

export default FeedTitleGroup;