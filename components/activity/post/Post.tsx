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
                    <div>Reaction</div>

                </div>
                <div className="w-full bg-slate-200/90 rounded-b-lg p-8 text-indigo-900">
                    <h3><b>chuquang2605</b></h3>
                    Cupiditate temporibus error tempora laborum. Quibusdam dolores veritatis enim optio debitis velit. Sequi dignissimos sint dolorem.
                </div>
        </div>
        

    )
}