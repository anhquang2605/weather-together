import React from 'react';
import style from './feed-component.module.css';
import { Feed } from '../../../../types/Feed';
import Post from '../../post/Post';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import { useSession } from 'next-auth/react';

interface FeedComponentProps {
    feed: Feed
}

const FeedComponent: React.FC<FeedComponentProps> = ({feed}) => {
    const {data: session} = useSession();
    const myUsername = session?.user?.username || "";
    const FeedCategorizer = async (feed: Feed) => {
        if(feed.type === 'post' || feed.type === 'comment'){
            const postId = feed.type === "comment" ? feed.targetParentId : feed.targetId;
            if(!postId){
                return null;
            }
            const post = await fetchPost(postId);
            if(post){
                return (
                    <Post post={post} username={myUsername} preview={true} />
                )
            }else{
                return null;
            }

        }else {
            return null;

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
    return (
        <div className={style['feed-component']}>
            {
                feed && FeedCategorizer(feed)
            }
        </div>
    );
};

export default FeedComponent;