import React from 'react';
import style from './feed-title-group.module.css';
import { Feed } from '../../../../types/Feed';
import FeedTitle from '../feed-title/FeedTitle';
import { useSession } from 'next-auth/react';
import { useFeedContext } from '../FeedsContext';
import {IoClose} from 'react-icons/io5';

interface FeedTitleGroupProps {
    feeds: Feed[];
    feedsDeleteHandler: (feeds: Feed[]) => void;
}

const FeedTitleGroup: React.FC<FeedTitleGroupProps> = ({feeds, feedsDeleteHandler}) => {
    const {data: session} = useSession();
    const myUsername = session?.user?.username || "";
    const {usernameToBasicProfileMap} = useFeedContext();
   
    return (
        <div className={style['feed-title-group'] + " glass rounded-lg border border-slate-400 border-b-0"}>
            <button title="Hide this feed" className={style['feed-hide-btn']} onClick={()=>{
                feedsDeleteHandler(feeds);
            }}>
                <IoClose className="text-lg"/>
            </button>
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