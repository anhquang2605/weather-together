import React, { useEffect } from 'react';
import style from './feed-content.module.css';
import { Feed, FeedGroup } from '../../../../types/Feed';
import FeedComponent from '../feed-component/FeedComponent';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import { useSession } from 'next-auth/react';
import { useFeedContext } from '../FeedsContext';
import Post from '../../post/Post';
import { type } from 'os';
interface FeedContentProps {
    contentId: string;
    activityId: string; //commentid
    type: string;

}

const FeedContent: React.FC<FeedContentProps> = ({type, activityId, contentId}) => {
    const {data: session} = useSession();
    const myUsername = session?.user?.username || "";
    const [feedJSX, setFeedJSX] = React.useState<JSX.Element | null>(null);
    const FeedCategorizer = async (type: string) => {
        if(type === 'posts') {
            const post = await fetchPost(contentId);
            if(post){
                setFeedJSX(       
                    <div className={style['feed-header']}>
                        <Post post={post} username={myUsername} preview={true}/>
                    </div>
                    
                );
            }
        }
        else if(type === 'comments'){
            const thisComment = activityId;
            let FeedJSX = null;
            const post = await fetchPost(contentId);
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

        }else if(type === 'pictures') {
            return <div>
                Picture
            </div>

        }else{
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
        if(type.length > 0 ){
            FeedCategorizer(type);
        }
    },[type])
    return (
        <div className={style['feed-content']}>
            {
                feedJSX
            }
        </div>
    );
};

export default FeedContent;