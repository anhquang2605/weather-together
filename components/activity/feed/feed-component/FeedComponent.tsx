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

interface FeedComponentProps {
    feed: Feed
}
interface FeedTitleProps {
    feed: Feed,
    username: string,
    relatedUser: string,
    myUsername: string,
    usernameToBasicProfileMap: {[username: string]: UserBasic}
}
const FeedTitle = (props:FeedTitleProps) => {
    const {feed, username, relatedUser, myUsername, usernameToBasicProfileMap} = props;
    const user = usernameToBasicProfileMap[username];
    const user2 = usernameToBasicProfileMap[relatedUser];
    const convertUserToMiniProfile = (user: UserBasic) => {
        return <UserMiniProfile user={user} sizeOfAvatar='small'/>
    }
    return (
        <div className={style['feed-title'] + " glass rounded-lg border border-slate-400 border-b-0"}>
        {
            username === myUsername ? 
            'You' : 
            user && convertUserToMiniProfile(user )
        }

        {
            feed.type.includes('comment') &&     ' commented on '
        }

        {
            feed.type.includes('post') && ' released a '}

        {
            feed.type.includes("comment") &&
            (                          
                relatedUser === myUsername ?
            'your ' :
             
                user2.username === user.username ?
                "their " 
                : convertUserToMiniProfile(user2) 
             
            ) 
        }
        {
            feed.targetType && feed.targetType.length > 0 && (
            feed.targetType)
        } 
         
        </div>
    )
}
const FeedComponent: React.FC<FeedComponentProps> = ({feed}) => {
    const [user, setUser] = useState<UserBasic | null>(null);//[username: string]: UserBasic} = {}
    const {data: session} = useSession();
    const myUsername = session?.user?.username || "";
    const {usernameToBasicProfileMap} = useFeedContext();
    const [feedJSX, setFeedJSX] = React.useState<JSX.Element | null>(null);
    const FeedCategorizer = async (feed: Feed) => {
        if(feed.type.includes('post')) {
            const postId = feed.activityId;
            if(!postId){
                return null;
            }
            const post = await fetchPost(postId);
            if(post){
                setFeedJSX(
                    
                    <div className={style['feed-header']}>
                        <FeedTitle
                            feed={feed}
                            username={feed.username}
                            relatedUser={feed.relatedUser || ''}
                            myUsername={myUsername}
                            usernameToBasicProfileMap={usernameToBasicProfileMap}
                        />
                        <Post post={post} username={myUsername} preview={true}/>
                    </div>
                    
                );
            }
        }
        else if(feed.type.includes('comment')){
            const postId = feed.targetType?.includes("comment") ? feed.targetParentId : feed.targetId;
            console.log('postId', postId);
            if(!postId){
                return null;
            }
            const targetComment = feed.type.includes('comment')? feed.targetId : feed.activityId;
            console.log('targetComment', targetComment);
            const post = await fetchPost(postId);
            if(post){
                setFeedJSX(
                    <>
                    <div className={style['feed-header']}>
                       <FeedTitle
                          feed={feed}
                            username={feed.username}
                            relatedUser={feed.relatedUser || ''}
                            myUsername={myUsername}
                            usernameToBasicProfileMap={usernameToBasicProfileMap}
                       />

                       


                    </div>
                    <Post post={post} username={myUsername} preview={true} previewCommentId={targetComment} />
                    </>
                )
            }else{
                return null;
            }

        }else if(feed.type.includes('picture')) {
            return <div>
                Picture
            </div>

        }else if(feed.type.includes('friend_made')){
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
        if(feed){
            FeedCategorizer(feed);
        }
    },[feed])
    

    return (
        <div className={style['feed-component']}>
            {
                feedJSX
            }
        </div>
    );
};

export default FeedComponent;