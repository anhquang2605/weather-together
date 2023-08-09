import { Post } from "../../../types/Post";
import PostTitle from "./post-title/PostTitle";
import style from "./post.module.css"
import { useContext, useEffect, useState } from "react";
import { MockContext } from "../../../pages/MockContext";
import ReactionsBar from "../reaction/reactions-bar/ReactionsBar";
import { fetchFromGetAPI } from "../../../libs/api-interactions";
import InteractionsBtns from "../interactions-btns/InteractionsBtns";
import PostSummary from "./post-summary/PostSummary";
import CommentForm from "../comment/comment-form/CommentForm";
import { PostContext } from "./PostContext";
import CommentList from "../comment/comment-list/CommentList";
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
    const [isCommenting, setIsCommenting] = useState(false);
    const [comments, setComments] = useState([]); //TODO: fetch comments from server
    const author = 'chuquang2605';
    const handleFetchReactionsGroups = async (targetId: string) => {
        const path = `reactions/get-reactions-by-groups`;
        const params = {
            targetId
        }
        const response = await fetchFromGetAPI(path, params);
        if(response.length){
            setReactionsGroups(response);
        }  
    }
    const handleFetctCommentsByPostId = async (postId: string) => {
        const path = `comments`;
        const params = {
            postId
        }
        const response = await fetchFromGetAPI(path, params);
        if(response.success){
            setComments(response.data);
        }
    }
    const handleCommentBtnClick = () => {
        setIsCommenting(prev => !prev);
    }
    useEffect(() => {
        handleFetchReactionsGroups(post._id?.toString() || '');
        handleFetctCommentsByPostId(post._id?.toString() || '');
    },[])
    return(
        <PostContext.Provider value={{post:post}}>
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
                    <PostSummary>
                        <ReactionsBar reactionsGroups={reactionsGroups}/>
                        <div className="comment-summary">
                            {comments.length > 0 ? `${comments.length} comments` : 'No comments'}
                        </div>
                    </PostSummary>

                    {/* Post attached images goes here */}
                </div>

                <InteractionsBtns 
                    targetStyle="extended"
                    targetId={post._id?.toString() || ''}
                    username={username || ''}
                    handleCommentBtnClick={handleCommentBtnClick}
                />
                <CommentForm 
                    targetType="posts"
                    username={author}  
                    isCommenting={isCommenting} 
                    setIsCommenting={setIsCommenting} 
                    targetId={""} 
                    postId={post._id?.toString()!} 
                    userProfilePicturePath={profilePicturePaths[author]} 
                />
                {comments && comments.length > 0 && <CommentList comments={comments} />}
                   
        </div>
        </PostContext.Provider>

    )
}