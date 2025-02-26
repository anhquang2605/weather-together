import style from './comment-component.module.css'
import { Comment } from '../../../types/Comment';
import MiniAvatar from '../../user/mini-avatar/MiniAvatar';
import { formatDistance } from 'date-fns';
import {useEffect, useState} from 'react';
import InteractionsBtns from '../interactions-btns/InteractionsBtns';
import CommentForm from './comment-form/CommentForm';
import { fetchFromGetAPI, insertToPostAPI } from '../../../libs/api-interactions';
import { Picture } from '../../../types/Picture';
import Image from 'next/image';
import PictureComponent from '../../embedded-view-components/picture-component/PictureComponent';
import {IoChatbubbles} from 'react-icons/io5';
import { CommentChildrenSummary } from '../../../types/CommentChildrenSummary';
import CommentList from './comment-list/CommentList';
import { UsernameToProfilePicturePathMap } from '../UsernameToProfilePicturePathMap';
import { useSession } from 'next-auth/react';
import { UserInSession } from '../../../types/User';
import ContentSummary from '../content-summary/ContentSummary';
import ReactionsBar from '../reaction/reactions-bar/ReactionsBar';
import ClickableUserTitle from '../../user/clickable-user-title/ClickableUserTitle';
interface CommentComponentProps{
    comment: Comment;
    profilePicturePath: string;
    commentorUsername: string;
    commentListRef: React.MutableRefObject<HTMLDivElement | null>;
    childrenNo: number;
    lastChild?: boolean;
    usernamesToNames: {[username: string]: string};
    waterFall?: boolean;
    waterFallComments?: Comment[];//case of waterfall
    curLevel?: number;
    childrenSummaryWaterFall?: CommentChildrenSummary;
}
interface UsernameToNameMap{
    [username: string]: string;
}
export default function CommentComponent(
    {
        comment,
        profilePicturePath,
        commentorUsername,
        commentListRef,
        childrenNo, 
        lastChild,
        usernamesToNames,
        waterFall,
        waterFallComments,
        curLevel, 
        childrenSummaryWaterFall
    }: CommentComponentProps
){
    const {username, createdDate, content, postId, pictureAttached, level, _id,  } = comment;
    const MAX_LEVEL = 2;
    const [reactionsGroups, setReactionsGroups] = useState([]);
    const [reactedUsernames, setReactedUsernames] = useState<string[]>([]); //TODO: fetch reacted usernames from server
    const [isFetchingReactions, setIsFetchingReactions] = useState(false);
    const [isFetchingNameMap, setIsFetchingNameMap] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [picture, setPicture] = useState<Picture | null>(null);
    const [gettingPicture, setGettingPicture] = useState(false);
    const [childComments, setChildComments] = useState<Comment[]>([]);
    const [commentorToAvatar, setCommentorToAvatar] = useState<UsernameToProfilePicturePathMap>({}); //TODO: fetch comments from server
    const [usernameToName, setUsernameToName] = useState<UsernameToNameMap>(usernamesToNames); //TODO: fetch comments from server
    const [commentChildrenSummary, setCommentChildrenSummary] = useState<CommentChildrenSummary>(childrenSummaryWaterFall ? childrenSummaryWaterFall : {});//this is used to tell the number of children comments of a comment
    const {data: session} = useSession();
    const user = session?.user as UserInSession;
    const author = user?.username as string;
    const optimisticCommentInsertion = (comment: Comment) => {
        setChildComments([comment,...childComments]);
        if(commentChildrenSummary[comment._id?.toString() || ''] === undefined){
            setCommentChildrenSummary({...commentChildrenSummary, [comment._id?.toString() || '']: 0});
        }
        if(commentorToAvatar[comment.username] === undefined){
            setCommentorToAvatar({...commentorToAvatar, [comment.username]: user?.profilePicturePath || ''});
        }
    };
    const handleGetPicture = async () => {
        // get picture from server
        setGettingPicture(true);
        const params = {
            targetId: _id?.toString() || '',
        }
        const response = await fetchFromGetAPI("pictures", params);
        if(response.success){
            setGettingPicture(false);
            setPicture(response.data);
        }
    }
    const handleScrollToForm = (form: React.MutableRefObject<HTMLDivElement | null>) => {
        if(form.current){
            form.current.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }
    const handleFetchReactionsGroups = async (targetId: string) => {
        setIsFetchingReactions(true);
        const path = `reactions/get-reactions-by-groups`;
        const params = {
            targetId
        }
        try{const response = await fetchFromGetAPI(path, params);
            if(response){
                setReactionsGroups(response.renamedGroup);
                setReactedUsernames(response.usernames);
            }

        }catch(err){
            console.log(err);
        }finally{
            setIsFetchingReactions(false);
        }
    }
    const handleFetchChildrenComments = async (targetId: string) => {
        const path = 'comments';
        const params = {
            targetId
        }
        const response = await fetchFromGetAPI(path, params);
        if(response.success){
            setChildComments(response.data.result);
            setCommentChildrenSummary(response.data.children);
            console.log("here");
            handleFetchProfilePathsToCommentors(response.data.commentors);
            handleFetchMoreUsernameToName(response.data.commentors);
        }
    }
    const handleFetchProfilePathsToCommentors = (usernames: string[]) => {
        const path = `users`;
        console.log("here");
        insertToPostAPI(path, usernames)
                .then(response => {
                    if(response.success){
                        console.log("subcomment" , response.data);
                        setCommentorToAvatar(response.data);
                    }
                })
    }
    const handleFetchMoreUsernameToName =  (usernames: string[], more?:boolean) => {
        setIsFetchingNameMap(true);
        //check if the username is already in the map
        //if all usernames are already in the map, return
        const usernamesTobeFetched = usernames.filter(username => usernamesToNames[username] === undefined);
        if(usernamesTobeFetched.length === 0){
            setIsFetchingNameMap(false);
            return;
        }
        const path = `user/username-to-name`;
        insertToPostAPI(path, usernamesTobeFetched)
                .then(async response => {
                    setIsFetchingNameMap(false);
                    if(!response){
                        
                        return;
                    }
                    if(response.success){
                        setUsernameToName({...usernameToName, ...response.data});
                    }
                })
    }
    useEffect(() => {
        if(pictureAttached){
            handleGetPicture();
        }
        handleFetchReactionsGroups(_id?.toString() || '');
    }, []);
    return(
        <div className={`${style['comment-component']} ${level > 0 ? style['child-comment'] : ''}`}>
            { ((!lastChild && level !== 0)) &&  <div className={style['edge-passing-child']}>
            </div>}
            {level !== 0 && <div className={style['merging-curve']}>

            </div>}
            <MiniAvatar className={style['comment-component__profile-picture']} username={username} profilePicturePath={profilePicturePath} size="medium" />
            <div className={style['content-group']}>
                <div className={style['content-group__self']}>
                    {(childrenNo > 0 || childComments.length > 0) && <div className={style['graph-edge']}></div>} 
                    <ClickableUserTitle 
                        username={username}
                        name={usernamesToNames?.[username] || ''}
                    />
                    {pictureAttached && picture && <PictureComponent
                        picture={picture}
                        alt={'comment picture'}
                        loading={gettingPicture}/>}
                    <div className={style['comment-bubble']}>
                        <div className={style['content-group__content']}>
                            {content}
                        </div>
                        <ReactionsBar 
                            reactionsGroups={reactionsGroups}
                            usernames={reactedUsernames}
                            targetId={_id?.toString() || ''}
                            isComment={true}
                        />
                    </div>
                    <div className={style['content-group__control-and-date']}>
                        <InteractionsBtns 
                            targetId={_id?.toString() || ''}
                            username={commentorUsername}
                            variant="shrinked"
                            handleCommentBtnClick={()=>{
                                setIsReplying(prev => !prev);
                            }}
                            canComment={level < MAX_LEVEL}
                            noReactionName={true}
                            targetType='comments'
                        />    
                        <div className={style['content-group__created-date']}>
                            {formatDistance(new Date(createdDate), new Date(), {addSuffix: true}).replace('about', '').replace('less than', '').replace('ago','')}
                        </div>  
                    </div> 
                    <CommentForm 
                        name={usernamesToNames?.[author] || ''}
                        targetId={_id?.toString() || ''} 
                        username={author} 
                        postId={postId} 
                        isCommenting={isReplying} 
                        scrollToCommentForm={handleScrollToForm}
                        userProfilePicturePath={user?.profilePicturePath || ''} 
                        targetType='comments' 
                        targetLevel={level}
                        parentListRef={commentListRef}
                        setIsCommenting={setIsReplying}
                        optimisticCommentInsertion={optimisticCommentInsertion}
                        _id={_id?.toString() || ''}
                        />
                {
                   ( childrenNo > 0 && childComments.length === 0 && (!waterFall || (curLevel !== undefined && curLevel === 0))) && <button className={style['view-replies-btn']}  onClick={()=> handleFetchChildrenComments(_id?.toString() || '')}>
                       <IoChatbubbles className="icon mr-1"/> {childrenNo} Replies
                    </button>
                }
                </div>
                {
                    ((curLevel !== undefined && curLevel > 0) || childComments.length > 0) &&
                    <CommentList 
                        scrollable={false}
                        comments={waterFall && waterFallComments && !childComments.length ? waterFallComments : childComments}
                        commentorToAvatarMap={commentorToAvatar}
                        topLevelListContainer={commentListRef}
                        children={commentChildrenSummary || {}}
                        commentor={commentorUsername}
                        usernamesToNames={usernameToName}
                        waterFall={waterFall && childComments.length === 0}
                        curLevel={curLevel !== undefined? curLevel - 1 : 0}

                    />
                }   
            </div>  
        </div>
    )
}