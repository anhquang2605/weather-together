import { Post } from "../../../types/Post";
import PostTitle from "./post-title/PostTitle";
import style from "./post.module.css"
import { useContext, useEffect, useState } from "react";
import { MockContext } from "../../../pages/MockContext";
import ReactionsBar from "../reaction/reactions-bar/ReactionsBar";
import { fetchFromGetAPI, insertToPostAPI } from "../../../libs/api-interactions";
import InteractionsBtns from "../interactions-btns/InteractionsBtns";
import CommentForm from "../comment/comment-form/CommentForm";
import { PostContext } from "./PostContext";
import CommentList from "../comment/comment-list/CommentList";
import { UsernameToProfilePicturePathMap } from "./../UsernameToProfilePicturePathMap";
import { CommentChildrenSummary } from "../../../types/CommentChildrenSummary";
import { useSession } from "next-auth/react";
import { set } from "lodash";
import LoadingBox from "../../skeletons/loading-box/LoadingBox";
import { Comment } from "../../../types/Comment";
import AttachedPictures from "./attached-pictures/AttachedPictures";
import ContentSummary from "../content-summary/ContentSummary";
import UserTags from "../user-tags/UserTags";
interface PostProps{
    post: Post;
    username?: string;
}
interface ReactionGroup{
    _id: string; //reaction name
    count: number;
}
interface UsernameToNameMap{
    [username: string]: string;
}
export default function Post({post,username}: PostProps){
    const  { profilePicturePaths } = useContext(MockContext);
    const  [ usernameToName, setUsernameToName ] = useState<UsernameToNameMap>({});
    const [reactionsGroups, setReactionsGroups] = useState([]);
    const [reactedUsernames, setReactedUsernames] = useState<string[]>([]); //TODO: fetch reacted usernames from server
    const [isCommenting, setIsCommenting] = useState(false);
    const [isFetchingComments, setIsFetchingComments] = useState(false);
    const [isFetchingReactions, setIsFetchingReactions] = useState(false);
    const [isFetchingNameMap, setIsFetchingNameMap] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]); //TODO: fetch comments from server
    const [commentorToAvatar, setCommentorToAvatar] = useState<UsernameToProfilePicturePathMap>({}); //TODO: fetch comments from server
    const [commentChildrenSummary, setCommentChildrenSummary] = useState<CommentChildrenSummary>({});
    const {data:session} = useSession();
    const user = session?.user;
    const author =  user?.username || '';
    const loading = isFetchingComments || isFetchingReactions || isFetchingNameMap;
    const optimisticCommentInsertion = (comment: Comment, name?: string) => {
        setComments(prev => [...prev, comment]);
        if(commentChildrenSummary[comment._id?.toString() || ''] === undefined){
            setCommentChildrenSummary({...commentChildrenSummary, [comment._id?.toString() || '']: 0});      
        }
        if(commentorToAvatar[comment.username] === undefined){
            setCommentorToAvatar({...commentorToAvatar, [comment.username]: profilePicturePaths[comment.username]});
        }
    };
    const handleFetchReactionsGroups = async (targetId: string) => {
        setIsFetchingReactions(true);
        const path = `reactions/get-reactions-by-groups`;
        const params = {
            targetId
        }
        const response = await fetchFromGetAPI(path, params);
        if(response){
            setReactionsGroups(response.renamedGroup);
            setReactedUsernames(response.usernames);
        }
        setIsFetchingReactions(false);
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
            setCommentChildrenSummary(response.data.children);
            handleFetchUsernameToName([...response.data.commentors, post.username]);
        }
        setIsFetchingComments(false);
        
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
    const handleFetchUsernameToName =  (usernames: string[]) => {
        setIsFetchingNameMap(true);
        const path = `user/username-to-name`;
        insertToPostAPI(path, usernames)
                .then(async response => {
                    setIsFetchingNameMap(false);
                    if(!response){
                        
                        return;
                    }
                    if(response.success){
        
                        setUsernameToName(response.data);
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
        <PostContext.Provider value={{post:post, commentorToAvatar, usernameToName}}>
        <div key={post._id} className={style['post'] + " glass-component"}>

        
                <div className={`${style['post-container']} px-8 pt-8`}>
                    <PostTitle 
                        username={post.username}
                        profilePicturePath={profilePicturePaths[post.username]}
                        weatherVibe={post.weatherVibe}
                        createdDate={post.createdDate}
                        visibility={post.visibility}
                        name={usernameToName[post.username] || ''}
                    />
                    <div className={style['post__content']}>
                        {post.content}
                    </div>
                    <div className="mb-4 flex">
                        <UserTags username={author} usernames={post.taggedUsernames}/>
                    </div>
                    {post.pictureAttached && <AttachedPictures
                        targetId={post._id?.toString() || ''}
                    />}
                    <div className="mb-4">   
                        <ContentSummary>
                            <ReactionsBar 
                                reactionsGroups={reactionsGroups}
                                usernames={reactedUsernames}
                                targetId={post._id?.toString() || ''}
                                />
                        </ContentSummary>
                    </div>
                  
                    <InteractionsBtns 
                        variant="extended"
                        targetId={post._id?.toString() || ''}
                        username={username || ''}
                        handleCommentBtnClick={handleCommentBtnClick}
                        canComment={true}
                    />
                    {/* Post attached images goes here */}
                </div>

               
                 {<CommentList 
                 scrollable={false}
                 usernamesToNames={usernameToName}
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
                    optimisticCommentInsertion={optimisticCommentInsertion}
                />
               
                   
        </div>
        </PostContext.Provider>

    )
}