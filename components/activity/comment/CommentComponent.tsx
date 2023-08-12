import style from './comment-component.module.css'
import { Comment } from '../../../types/Comment';
import MiniAvatar from '../mini-avatar/MiniAvatar';
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
interface CommentComponentProps{
    comment: Comment;
    profilePicturePath: string;
    commentorUsername: string;
    commentListRef: React.MutableRefObject<HTMLDivElement | null>;
    childrenNo: number;
}

export default function CommentComponent(
    {
        comment,
        profilePicturePath,
        commentorUsername,
        commentListRef,
        childrenNo
    }: CommentComponentProps
){
    const {username, createdDate, content, postId, pictureAttached, level, _id} = comment;
    const MAX_LEVEL = 2;
    const [isReplying, setIsReplying] = useState(false);
    const [picture, setPicture] = useState<Picture | null>(null);
    const [gettingPicture, setGettingPicture] = useState(false);
    const [childComments, setChildComments] = useState<Comment[]>([]);
    const [commentorToAvatar, setCommentorToAvatar] = useState<UsernameToProfilePicturePathMap>({}); //TODO: fetch comments from server
    const [commentChildrenSummary, setCommentChildrenSummary] = useState<CommentChildrenSummary>();
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
            form.current.scrollIntoView({behavior: 'smooth'});
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
            handleFetchProfilePathsToCommentors(response.data.commentors)
        }
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
        if(pictureAttached){
            handleGetPicture();
        }
    }, []);
    return(
        <div className={`${style['comment-component']} ${level > 0 ? style['child-comment'] : ''}`}>
            <MiniAvatar profilePicturePath={profilePicturePath} />
            <div className={style['content-group']}>
                <div className={style['content-group__self']}>
                    {childrenNo > 0 && <div className={style['graph-edge']}></div>} 
                    <div className={style['content-group__username']}>
                        {username}
                    </div>
                    {pictureAttached && <PictureComponent
                        picture={picture}
                        alt={'comment picture'}
                        loading={gettingPicture}/>}

                    <div className={style['content-group__content']}>
                        {content}
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
                        />    
                        <div className={style['content-group__created-date']}>
                            {formatDistance(new Date(createdDate), new Date(), {addSuffix: true}).replace('about', '').replace('less than', '').replace('ago','')}
                        </div>  
                    </div> 
                    <CommentForm 
                        targetId={_id?.toString() || ''} 
                        username={commentorUsername} 
                        postId={postId} 
                        isCommenting={isReplying} 
                        scrollToCommentForm={handleScrollToForm}
                        userProfilePicturePath={profilePicturePath} 
                        targetType='comments' 
                        targetLevel={level}
                        parentListRef={commentListRef}
                        />
                {
                   ( childrenNo > 0 && childComments.length === 0) && <button className={style['view-replies-btn']}  onClick={()=> handleFetchChildrenComments(_id?.toString() || '')}>
                       <IoChatbubbles className="icon mr-1"/> {childrenNo} Replies
                    </button>
                }
                </div>
                {
                    childComments.length > 0 &&
                    <CommentList 
                        comments={childComments}
                        commentorToAvatarMap={commentorToAvatar}
                        topLevelListContainer={commentListRef}
                        children={commentChildrenSummary || {}}
                        commentor={commentorUsername}
                    />
                }   
            </div>  
        </div>
    )
}