import { Post } from "../../../types/Post";
import style from "./post.module.css"
import { useContext } from "react";
interface PostProps{
    post: Post;
}
export default function Post({post}: PostProps){
    
    return(
        <div className={style['post']}>
            
        </div>
    )
}