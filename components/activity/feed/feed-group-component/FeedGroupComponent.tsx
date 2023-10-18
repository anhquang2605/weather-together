import React, { useEffect, useState } from 'react';
import style from './feed-group-component.module.css';
import { Feed, FeedGroup } from '../../../../types/Feed';
import { UserBasic } from '../../../../types/User';
import Post from '../../post/Post';
import FeedTitleGroup from '../feed-title-group/FeedTitleGroup';
import FeedContent from '../feed-content/FeedContent';

interface FeedGroupComponentProps {
    feedGroup: FeedGroup;
}

const FeedGroupComponent: React.FC<FeedGroupComponentProps> = ({feedGroup}) => {
    const [group, setGroup] = useState<FeedGroup | null>(null);
    useEffect(()=>{
        if(feedGroup){
            setGroup(feedGroup);
        }
    },[feedGroup])
    const [user, setUser] = useState<UserBasic | null>(null);//[username: string]: UserBasic} = {}
    
   

    return (
        <div className={style['feed-group-component']}>
            {
                group &&
                <>
                    <FeedTitleGroup 
                        feeds={group.feeds}
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
        </div>
    );
};

export default FeedGroupComponent;