import { Post } from "../../../types/Post";
import PostTitle from "./post-title/PostTitle";
import style from "./post.module.css"
import { useContext, useEffect, useState } from "react";
import { MockContext } from "../../../pages/MockContext";
import ReactionsBar from "../reaction/reactions-bar/ReactionsBar";
import { fetchFromGetAPI, insertToPostAPI } from "../../../libs/api-interactions";
import InteractionsBtns from "../interactions-btns/InteractionsBtns";
import PostSummary from "./post-summary/PostSummary";
import CommentForm from "../comment/comment-form/CommentForm";
import { PostContext } from "./PostContext";
import CommentList from "../comment/comment-list/CommentList";
import { UsernameToProfilePicturePathMap } from "./../UsernameToProfilePicturePathMap";
import { CommentChildrenSummary } from "../../../types/CommentChildrenSummary";
import { useSession } from "next-auth/react";
import { set } from "lodash";
import LoadingBox from "../../skeletons/loading-box/LoadingBox";
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
    const [isFetchingComments, setIsFetchingComments] = useState(false);
    const [isFetchingReactions, setIsFetchingReactions] = useState(false);
    const [comments, setComments] = useState([]); //TODO: fetch comments from server
    const [commentorToAvatar, setCommentorToAvatar] = useState<UsernameToProfilePicturePathMap>({}); //TODO: fetch comments from server
    const [commentChildrenSummary, setChildrenSummary] = useState<CommentChildrenSummary>({});
    const {data:session} = useSession();
    const user = session?.user;
    const author =  user?.username || '';
    const loading = isFetchingComments && isFetchingReactions;
    const handleFetchReactionsGroups = async (targetId: string) => {
        setIsFetchingReactions(true);
        const path = `reactions/get-reactions-by-groups`;
        const params = {
            targetId
        }
        const response = await fetchFromGetAPI(path, params);
        if(response.length){
            setReactionsGroups(response);
            setIsFetchingReactions(false);
        }  
    }
    const handleScrollToForm = (form: React.MutableRefObject<HTMLDivElement | null>) => {
        if(form.current){
            form.current.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }
    const handleFetctCommentsForPost = async (targetId: string, postId:string) => {
        setIsFetchingComments(true);
        const path = `comments`;
        const params = {
            targetId, 
            postId
        }
        const response = await fetchFromGetAPI(path, params);
        if(response.success){
            setComments(response.data.result);
            handleFetchProfilePathsToCommentors(response.data.commentors);
            setChildrenSummary(response.data.children);
            setIsFetchingComments(false);
        }
    }
    const handleCommentBtnClick = () => {
        setIsCommenting(prev => !prev);
    }
    const handleFetchProfilePathsToCommentors = (usernames: string[]) => {
        const path = `users`;
        insertToPostAPI(path, usernames)
                .then(response => {
                    if(response.success){
                        setCommentorToAvatar(response.data);
                    }
                })
    }
    useEffect(() => {
        handleFetchReactionsGroups(post._id?.toString() || '');
        handleFetctCommentsForPost('', post._id?.toString() || '');
    },[])
    if(loading){
        return <LoadingBox variant="large" long={true} withChildren={false}/>
    }
    return(
        <PostContext.Provider value={{post:post, commentorToAvatar}}>
        <div key={post._id} className={style['post'] + " glass"}>

        
                <div className={`${style['post-container']} px-8 pt-8`}>
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
                    <InteractionsBtns 
                        variant="extended"
                        targetId={post._id?.toString() || ''}
                        username={username || ''}
                        handleCommentBtnClick={handleCommentBtnClick}
                        canComment={true}
                    />
                    {/* Post attached images goes here */}
                </div>

               
                 {comments && comments.length > 0 && <CommentList 
                 scrollable={false}
                 children={commentChildrenSummary} commentor={author} comments={comments} commentorToAvatarMap={commentorToAvatar} />}
                <CommentForm 
                    _id={post._id?.toString()!}
                    targetType="posts"
                    username={author}  
                    isCommenting={isCommenting} 
                    scrollToCommentForm={handleScrollToForm} 
                    targetId={""} 
                    postId={post._id?.toString()!} 
                    userProfilePicturePath={profilePicturePaths[author]}
                    setIsCommenting={setIsCommenting}
                />
               
                   
        </div>
        </PostContext.Provider>

    )
}