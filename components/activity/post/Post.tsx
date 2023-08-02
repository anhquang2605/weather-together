import { Post } from "../../../types/Post";
import PostTitle from "./post-title/PostTitle";
import style from "./post.module.css"
import { useContext } from "react";
import { MockContext } from "../../../pages/MockContext";
interface PostProps{
    post: Post;
}

export default function Post({post}: PostProps){
    const  { profilePicturePaths } = useContext(MockContext);
    return(
        <div className={style['post']}>

        
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
                </div>
                
               
        </div>
        

    )
}