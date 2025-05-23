import { PostType } from "../../../types/Post";
import PostTitle from "./post-title/PostTitle";
import style from "./post.module.css"
import { use, useContext, useEffect, useRef, useState } from "react";
import { MockContext } from "../../../context/MockContext";
import ReactionsBar from "../reaction/reactions-bar/ReactionsBar";
import { deleteFromDeleteAPI, fetchFromGetAPI, insertToPostAPI } from "../../../libs/api-interactions";
import InteractionsBtns from "../interactions-btns/InteractionsBtns";
import CommentForm, { CommentFormState } from "../comment/comment-form/CommentForm";
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
import { usePostModalContext } from "./post-modal-context/PostModalContext";
import LazyTarget from "../../lazy-taget/LazyTarget";
import { is } from "date-fns/locale";
import ContentManagement, { ManagementItem } from "../content-management/ContentManagement";
import Modal from "../../modal/Modal";
import { PostFormProvider } from "./post-engagement/usePostFormContext";
import { ViewSliderProvider } from "../../plugins/view-slider/useViewSliderContext";
import PostForm from "./post-form/PostForm";
import BuddyTagForm from "./post-form/friend-tag-form/BuddyTagForm";
import { PostFormContextProvider } from "./post-form/postFormContext";
import { getRandomString } from "../../../libs/general";
import ApiStatusPop from "../../api-status-pop/apistatuspop";
import ConfirmationBox from "../../confirmation-box/ConfirmationBox";
import { Comme } from "next/font/google";
import CommentNumber from "../comment/comment-number/CommentNumber";
interface PostProps{
    postProp: PostType;
    username?: string;
    preview?: boolean;
    previewCommentId?: string;
    onFinishedLoading?: () => void;
}
interface ReactionGroup{
    _id: string; //reaction name
    count: number;
}
interface UsernameToNameMap{
    [username: string]: string;
}
interface CommentFetchParams{
    targetId?: string;
    postId?: string;
    limit?: string;
    level?: string;
    lastCursor: string;
    _id?: string;
    isGettingCounts?: string; //but boolean like 'true' or 'false', when convert the params, boolean value must be string to avoid json parse error
}
const INITIAL_POST_STATE: PostType = {
   _id: '',
    username: '',
    content: '',
    visibility: 'public',
    taggedUsernames: [],
    pictureAttached: false,
    createdDate: new Date(),
    updatedDate: new Date(), 
}
const RANDOM_STRING_LENGTH = 20;
export default function Post({postProp,username, preview, previewCommentId, onFinishedLoading}: PostProps){
    const {setShow, setTitle, setCurPostId, setExtraCloseFunction} = usePostModalContext();
    const [post, setPost] = useState<PostType>({...INITIAL_POST_STATE}); //TODO: fetch post from server
    const  { profilePicturePaths } = useContext(MockContext);
    const  [ usernameToName, setUsernameToName ] = useState<UsernameToNameMap>({});
    const [fetchingStatus, setFetchingStatus] = useState('idle'); //['idle', 'loading', 'error', 'success']
    const [reactionsGroups, setReactionsGroups] = useState([]);
    const [reactedUsernames, setReactedUsernames] = useState<string[]>([]); //TODO: fetch reacted usernames from server
    const [reveal, setReveal] = useState(false); //for delete api status pop
    const [commentsCount, setCommentsCount] = useState(0);
    const [isCommenting, setIsCommenting] = useState(false);
    const [isFetchingComments, setIsFetchingComments] = useState(false);
    const [isFetchingMoreComments, setIsFetchingMoreComments] = useState(false); 
    const [isFetchingReactions, setIsFetchingReactions] = useState(false);
    const [isFetchingNameMap, setIsFetchingNameMap] = useState(false);
    const [deletePostStatus, setDeletePostStatus] = useState({
        type: 'idle',
        message: ''
    }); //['idle', 'loading', 'error', 'success'
    const [loading, setLoading] = useState(true); //TODO: fetch comments from server
    const [endOfList, setEndOfList] = useState(false); //when comment list hit the bottom
    const [lastCursor, setLastCursor] = useState<Date>(new Date()); //TODO: fetch comments from server
    const [waterFall, setWaterFall] = useState<boolean>(false); //TODO: fetch comments from server
    const [comments, setComments] = useState<Comment[]>([]); //TODO: fetch comments from server
    const [commentorToAvatar, setCommentorToAvatar] = useState<UsernameToProfilePicturePathMap>({}); //TODO: fetch comments from server
    const [hasMoreComments, setHasMoreComments] = useState(true); //TODO: fetch comments from server
    const [commentChildrenSummary, setCommentChildrenSummary] = useState<CommentChildrenSummary>({});
    const [uniqueString, setUniqueString] = useState<string>(''); //TODO: fetch comments from server
    const [revealDeleteConfirmation, setRevealDeleteConfirmation] = useState(false); //TODO: fetch comments from server
    //edit form
    const [revealEditForm, setRevealEditForm] = useState(false);
    const cursorRef = useRef(lastCursor);
    const {data:session} = useSession();
    const user = session?.user;
    const author =  user?.username || '';
    const commentPreviewLimit = 1;
    const limitPerFetch = 3;
    //POST MANAGEMENT ITEMS
    //define higher order functions, the function will accept the postid as an argument
    const handleEditPost = (postid: string) => async () => {
        //trigger post form and feed all the current post information into it
        setRevealEditForm(true);
    }
    const handleDeletePost = (postid: string) => async () => {
        setDeletePostStatus({type:'loading', message: 'Deleting post...'});

        //finally delete the post itself
        const postPath = "posts";
        const postParams = {
            postId: postid,
            pictureAttached: post.pictureAttached
        }
        const response = await deleteFromDeleteAPI(postPath, postParams);
        if(response.success){
            setDeletePostStatus({type:'success', message: 'Delete Successful!'});
        } else{
            setDeletePostStatus({type:'error', message: 'Delete Failed!'});
        }
    }
    const handleRevealDeleteConfirmation = () => async () => {
        setRevealDeleteConfirmation(true);
    }
    const handleCancelDelete = () => async () => {
        setRevealDeleteConfirmation(false);
    }
    const handleDeletionConfirmation = async () => {
        setRevealDeleteConfirmation(false);
        try{
            const delFunc = await handleDeletePost(post._id?.toString() || '');
            await delFunc();
        }catch(e){
            console.log(e);
        }
        
    }
    const handleSavePost = (postid: string) => async () => {
        console.log("save post #" + postid);
    }
    const items:ManagementItem[] = [
        {
            type: 'Edit',
            handler: handleEditPost(post._id?.toString() || ''),
        },
        {
            type: 'Delete',
            handler: handleRevealDeleteConfirmation(),
        },
        {
            type: 'Save',
            handler:  handleSavePost(post._id?.toString() || ''),   
        }
    ]
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
    const getTotalCommentsCount = (postId: string) => {
        const params = {
            postId,
            isGettingCounts: 'true'
        }
        const result = fetchFromGetAPI('comments', params);
        result.then(res => {
            if(res && res.data){
                setCommentsCount(res.data.count);
            } else {
                setCommentsCount(0);
                console.log('error fetching comments count');
            }
        })
    }
    const handleScrollToForm = (form: React.MutableRefObject<HTMLDivElement | null>) => {
        if(form.current && preview){
            form.current.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }
    const handleFetctCommentsForPost = async (targetId: string, postId:string, more?:boolean) => {
        if (more) {setFetchingStatus('loading')}
        else{
            setIsFetchingComments(true);
        };
        const path = `comments`;
        
       
        const params:CommentFetchParams = {
            targetId, 
            postId,
            lastCursor: typeof cursorRef.current === "object"? cursorRef.current.toISOString() : cursorRef.current
        }
        if(preview){

            params.limit = commentPreviewLimit.toString();
            params.level = '0';
            params.isGettingCounts = 'true';
            if(previewCommentId && previewCommentId.length > 0){
                params._id = previewCommentId;
                delete params.targetId;
                delete params.postId;
            }
        }else{
            params.limit = limitPerFetch.toString();
        }
        const response = await fetchFromGetAPI(path, params);
        if(response && response.data){
            handleFetchProfilePathsToCommentors(response.data.commentors);
            handleFetchUsernameToName([...response.data.commentors, post.username]);
            if(preview){
                const resultComments = response.data.result;
                setWaterFall(true);
                setComments(resultComments);
                setCommentChildrenSummary(response.data.children);
                setIsFetchingComments(false);
                return;
            }
            if(more){
                setComments(prev => [...prev, ...response.data.result]);
                setCommentChildrenSummary(prev => ({...prev, ...response.data.children}));
                setLastCursor(response.data.lastCursor);
            }else{
                setComments(response.data.result);
                setCommentChildrenSummary(response.data.children);
                setLastCursor(response.data.lastCursor);
            }
          
        }else{
            setFetchingStatus('error');           
        }
        if(!more){
            setIsFetchingComments(false);
        }
    }
    const handleCommentBtnClick = () => {
        setIsCommenting(prev => !prev);
    }
    
    const handleFetchProfilePathsToCommentors = (usernames: string[], more?:boolean) => {
        const path = `users`;
        insertToPostAPI(path, usernames)
                .then(response => {
                    if(response.success){
                        setCommentorToAvatar(prev => ({...prev, ...response.data}));
                    }else{
                        if(more){
                            return false;
                        }
                    }
                    
                })
    }
    const handleFetchUsernameToName =  (usernames: string[], more?:boolean) => {
        setIsFetchingNameMap(true);
        const path = `user/username-to-name`;
        insertToPostAPI(path, usernames)
                .then((response) => {
                    if(response.success){

                        setUsernameToName(prev => 
                            {
                                const newState = {...prev};
                                for (const [key, value] of Object.entries(response.data)) {
                                    if(newState[key] === undefined){
                                        newState[key as string] = value as string;
                                    }
                                }
                                return newState;
                            }
                        );
                    }else{
                        throw new Error("did not get username to name map");
                        
                    }
                }).catch(e => {
                    console.log(e);
                }).finally(()=>{
                    setIsFetchingNameMap(false);    
                })
    }
    const handleViewPostModal = () => {
        setShow(true);
        setTitle(`Post by ${usernameToName[post.username] || post.username}`);

        setCurPostId(post._id?.toString() || '');
    }
    const handleOnCloseModal = () => {
        setRevealEditForm(false);
    }
    useEffect(()=>{
        if(postProp){
            setPost(postProp);
        }
    },[postProp])
    useEffect(() => {
        if(post && post._id !== ''){
            getTotalCommentsCount(post._id?.toString() || '');
            handleFetchReactionsGroups(post._id?.toString() || '');
            handleFetctCommentsForPost('', post._id?.toString() || '');
            setUniqueString(getRandomString(RANDOM_STRING_LENGTH));
        }
    },[post])

    useEffect(()=>{
        cursorRef.current = lastCursor;
    },[lastCursor])
    useEffect(()=>{
        if(fetchingStatus === "loading"){
            if(!isFetchingComments && !isFetchingNameMap){
                setFetchingStatus('success');
            }
        }else{
            setLoading(isFetchingComments || isFetchingReactions || isFetchingNameMap);
        }
    },[isFetchingComments, isFetchingReactions, isFetchingNameMap])
    useEffect(()=>{
        if(endOfList && hasMoreComments && !preview){
            handleFetctCommentsForPost('', post._id?.toString() || '', true);
        }
    },[endOfList])
    useEffect(()=>{
        if(deletePostStatus.type === 'loading' || deletePostStatus.type === 'error'){
            setReveal(true);
        }else{
            setReveal(false);
        }
    },[deletePostStatus])
    return(
        <PostContext.Provider value={{post:post, commentorToAvatar, usernameToName}}>
        {loading ? <LoadingBox isFluid={true} extraClassname="feed-page-main-components" variant="" long={true} withChildren={false}/> :
        <>
            <div key={post._id} id={"post_"+ (preview ? "" : "modal_")  + post._id} className={style['post'] + " glass-component " + (preview? "feed-page-main-components" :  "")}>
                <ContentManagement  
                    items={items}
                    isOwner = {author === post.username}
                />
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
                        {post.taggedUsernames && post.taggedUsernames.length > 0 &&<UserTags username={author} usernames={post.taggedUsernames}/>}
                    </div>
                    {post.pictureAttached && <AttachedPictures
                        targetId={post._id?.toString() || ''}
                        uniqueString={uniqueString}
                    />}
                    <div className="mb-4">   
                        <ContentSummary>
                            <ReactionsBar 
                                reactionsGroups={reactionsGroups}
                                usernames={reactedUsernames}
                                targetId={post._id?.toString() || ''}
                                />
                            {commentsCount > 0 && <CommentNumber count={commentsCount}/>}
                        </ContentSummary>
                    </div>
                  
                    <InteractionsBtns 
                        variant="extended"
                        targetId={post._id?.toString() || ''}
                        username={author || ''}
                        handleCommentBtnClick={handleCommentBtnClick}
                        canComment={true}
                        targetType="posts"
                    />
                    {/* Post attached images goes here */}
                </div>
                {
                    preview && comments.length > 0 && 
                    <button className="mt-4 ml-8 font-bold hover:underline" onClick={handleViewPostModal} >
                        View more comments
                    </button>
                }
               
                 {<CommentList 
                 waterFall={waterFall}
                 curLevel={comments.length - 1}
                 scrollable={false}
                 setEndOfList={setEndOfList}
                 fetchingMoreCommentStatus={fetchingStatus}
                 usernamesToNames={usernameToName}
                 isPreviewed={preview}
                 postID={"post_"+ (preview ? "" : "modal_") + post._id?.toString()!}
                 daChildren={commentChildrenSummary} commentor={author} comments={comments} commentorToAvatarMap={commentorToAvatar} />}
                {preview && <CommentForm
                    key={"preview-comment-form"}
                    preview={true} 
                    name={usernameToName[author] || ''}
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
                    forPost={true}
                />}    
            </div>
            {
                !preview &&
                 <CommentForm 
                    key={"none-preview-comment-form"}
                    preview={false}
                    name={usernameToName[author] || ''}
                    _id={post._id?.toString()!}
                    targetType="posts"
                    username={author}  
                    isCommenting={true} 
                    scrollToCommentForm={handleScrollToForm} 
                    targetId={""} 
                    postId={post._id?.toString()!} 
                    userProfilePicturePath={profilePicturePaths[author]}
                    setIsCommenting={setIsCommenting}
                    optimisticCommentInsertion={optimisticCommentInsertion}
                    forPost={true}
                />
            }
            <ApiStatusPop status={deletePostStatus} redirectPageName="" show={
                reveal
            }
            setApiStatus={setDeletePostStatus}
            setReveal={setReveal}    
            closeButtonShown={false}
            />
            <Modal status={revealEditForm} containerClassName='form-container' onClose={handleOnCloseModal}>
                <PostFormContextProvider>
                    <PostFormProvider>
                        <ViewSliderProvider
                            childSlidesContent={
                                [
                                    
                                        <PostForm
                                        key={"post-form"}
                                        setRevealModal={setRevealEditForm}
                                        username={author}
                                        post = {post}
                                        revealed={revealEditForm}
                                        setPost={setPost}
                                        />
                                        ,
                                    <BuddyTagForm
                                        key={"post-form-buddy-tag"}
                                        username={author}
                                    />
                                ]
                            }
                        />
                    </PostFormProvider>
                </PostFormContextProvider>
            </Modal>
            <Modal size="sm" containerClassName='form-container' status={revealDeleteConfirmation} onClose={handleCancelDelete()}>
                <ConfirmationBox
                    confirmHandler={handleDeletionConfirmation}
                    cancelHandler={handleCancelDelete()}
                    confirmText="Are you sure you want to delete this post?"
                />
            </Modal>
        </>
        }
        </PostContext.Provider>
    )
}