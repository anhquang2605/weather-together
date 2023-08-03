import { Post } from "../../../types/Post";
import PostTitle from "./post-title/PostTitle";
import style from "./post.module.css"
import { useContext, useEffect, useState } from "react";
import { MockContext } from "../../../pages/MockContext";
import ReactionsBar from "../reaction/reactions-bar/ReactionsBar";
import { fetchFromGetAPI } from "../../../libs/api-interactions";
import InteractionsBtns from "../interactions-btns/InteractionsBtns";
interface PostProps{
    post: Post;
    username?: string;
}
interface ReactionGroup{
    _id: string; //reaction name
    count: number;
}
export default function Post({post,username}: PostProps){
    const  { profilePicturePaths } = useContext(MockContext);
    const [reactionsGroups, setReactionsGroups] = useState([]);
    const handleFetchReactionsGroups = async (targetId: string) => {
        const path = `reactions/get-reactions-by-groups`;
        const params = {
            targetId
        }
        const response = await fetchFromGetAPI(path, params);
        if(response.status === 200 ){
            const reactionsGroups = await response.json();
            if(reactionsGroups !== null) setReactionsGroups(reactionsGroups);
        }  
    }
    useEffect(() => {
        handleFetchReactionsGroups(post._id?.toString() || '');
    },[])
    return(
        <div key={post._id} className={style['post']}>

        
                <div className={style['post-container'] + " glass"}>
                    <PostTitle 
                        username={post.username}
                        profilePicturePath={profilePicturePaths[post.username]}
                        weatherVibe={post.weatherVibe}
                        createdDate={post.createdDate}
                        visibility={post.visibility}
                    />
                    <div className={style['post__content']}>
                        {post.content}
                    </div>
                    {/* Post attached images goes here */}
                    <ReactionsBar reactionsGroups={reactionsGroups}/>
                </div>
                <InteractionsBtns 
                    targetId={post._id?.toString() || ''}
                    username={username || ''}
                />
               
        </div>
        

    )
}