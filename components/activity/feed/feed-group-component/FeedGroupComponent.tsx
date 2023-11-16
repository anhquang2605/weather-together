import React, { useEffect, useState } from 'react';
import style from './feed-group-component.module.css';
import { Feed, FeedGroup } from '../../../../types/Feed';
import { UserBasic } from '../../../../types/User';
import Post from '../../post/Post';
import FeedTitleGroup from '../feed-title-group/FeedTitleGroup';
import FeedContent from '../feed-content/FeedContent';
import { deleteFromDeleteAPI, updateToPutAPI } from '../../../../libs/api-interactions';

interface FeedGroupComponentProps {
    feedGroup: FeedGroup;
}

const FeedGroupComponent: React.FC<FeedGroupComponentProps> = ({feedGroup}) => {
    const [group, setGroup] = useState<FeedGroup | null>(null);
    const [hide, setHide] = useState<boolean>(false);
    useEffect(()=>{
        if(feedGroup){
            setGroup(feedGroup);
        }
    },[feedGroup])
    const [user, setUser] = useState<UserBasic | null>(null);//[username: string]: UserBasic} = {}
    const handleHideFeeds = async (feeds: Feed[]) => {
        if(feeds.length >= 1){
            const feedActIds = feeds.map(feed => feed.activityId);
            const path = "feeds/hide-feeds-by-ids";
            const body = {
                actIds: feedActIds
            }
            const result = await updateToPutAPI(path, body);
            if(result.success){
                setHide(true);
            }else{
                console.log(result);
            }
        }
    }
    const handleUnhideFeeds = async (feeds: Feed[]) => {
        if(feeds.length >= 1){
            const path = "feeds/undelete-feeds-by-ids";
            const body = {
                feedIds: feeds.map(feed => feed._id)
            }
            const result = await deleteFromDeleteAPI(path, body);
        }
    }
   

    return (
        !hide ? <div className={`${style['feed-group-component']} `  }>
            {
                group &&
                <>
                    <FeedTitleGroup 
                        feeds={group.feeds.sort((a,b) => {
                            return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
                        })}
                        feedsDeleteHandler={handleHideFeeds}
                    />
                    {group.targetContentId !== "" && 
                        <FeedContent
                            contentId={group.targetContentId}
                            activityId={group.lastestActivityId}
                            type={group.feeds[group.latestIndex].type}                    
                        />
                    }
                </>

            }
        </div> : 
        <div className={style['unhide-header']}>
            <button onClick={()=>{
                handleUnhideFeeds(group?.feeds || []);
            }}>
                Unhide
            </button>
        </div>
        
    );
};

export default FeedGroupComponent;