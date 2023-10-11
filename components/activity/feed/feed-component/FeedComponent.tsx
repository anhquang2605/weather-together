import React, { useEffect } from 'react';
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
    const [feedJSX, setFeedJSX] = React.useState<JSX.Element | null>(null);
    const FeedCategorizer = async (feed: Feed) => {
        console.log(feed);
        if(feed.type === 'post' || feed.type === 'comment'){
            const postId = feed.type === "comment" ? feed.targetParentId : feed.targetId;
            if(!postId){
                return null;
            }
            const post = await fetchPost(postId);
            if(post){
                console.log(post);
                setFeedJSX(
                    //post need to have extra prop that display a specific comment in the preview
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
    useEffect(() => {
        feed && FeedCategorizer(feed);
    },[feed])
    return (
        <div className={style['feed-component']}>
            <div>
                    {feed.title}
            </div>
            {
                feedJSX
            }
        </div>
    );
};

export default FeedComponent;