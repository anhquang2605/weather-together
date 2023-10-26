import React, { useEffect, useState } from 'react';
import style from './feed-component.module.css';
import { Feed } from '../../../../types/Feed';
import Post from '../../post/Post';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import { useSession } from 'next-auth/react';
import UserMiniProfile from '../../../user/user-mini-profile/UserMiniProfile';
import { UserBasic } from '../../../../types/User';
import { useFeedContext } from '../FeedsContext';
import { set } from 'lodash';
import FeedTitle from '../feed-title/FeedTitle';

interface FeedComponentProps {
    feed: Feed,
    willFetchContent?: boolean
}

const FeedComponent: React.FC<FeedComponentProps> = ({feed, willFetchContent}) => {
    const [user, setUser] = useState<UserBasic | null>(null);//[username: string]: UserBasic} = {}
    const {data: session} = useSession();
    const myUsername = session?.user?.username || "";
    const {usernameToBasicProfileMap} = useFeedContext();
    const [feedJSX, setFeedJSX] = React.useState<JSX.Element | null>(null);
    const FeedCategorizer = async (feed: Feed) => {
        if(feed.type === 'posts') {
            const postId = feed.activityId;
            if(!postId){
                return null;
            }
            const post = await fetchPost(postId);
            if(post){
                setFeedJSX(       
                    <div className={style['feed-header']}>
                        <Post post={post} username={myUsername} preview={true}/>
                    </div>
                    
                );
            }
        }
        else if(feed.type === 'comments'){
            const postId = feed.targetType === "comments" ? feed.targetParentId : feed.targetId;

            if(!postId){
                return null;
            }
            const thisComment = feed.activityId;
            let FeedJSX = null;

            const post = await fetchPost(postId);
            if(post){
                setFeedJSX(
                    <>
                    <div className={style['feed-header']}>

                    </div>
                    <Post post={post} username={myUsername} preview={true} previewCommentId={thisComment} />
                    </>
                )
            }else{
                return null;
            }

        }else if(feed.type === 'pictures') {
            return <div>
                Picture
            </div>

        }else if(feed.type === 'buddy_made'){
            return <div>
                Friend made
            </div>
        } else {
            return <div>
                {feed.title + feed.type}
            </div>
        }
    };
    const fetchPost = async (postId: string) => {
        const path = 'posts';
        const params = {
            postId
        }
        const response = await fetchFromGetAPI(path, params);
        if(response.success){
            return response.data;
        }
        return null;
    }
   
    useEffect(() => {
        if(feed && willFetchContent){
            FeedCategorizer(feed);
        }
    },[feed])
    

    return (
        <div className={style['feed-component']}>
            <FeedTitle
                feed={feed}
                myUsername={myUsername}
                usernameToBasicProfileMap={usernameToBasicProfileMap}
            />
            {
                feedJSX
            }
        </div>
    );
};

export default FeedComponent;