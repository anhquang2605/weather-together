import React, { useEffect, useState } from 'react';
import style from './picture-interaction-panel.module.css';
import { UserInClient } from '../../../../types/User';
import UserMiniProfile from '../../../user/user-mini-profile/UserMiniProfile';
import InteractionsBtns from '../../../activity/interactions-btns/InteractionsBtns';
import { UsernameToProfilePicturePathMap } from '../../../activity/UsernameToProfilePicturePathMap';
import { CommentChildrenSummary } from '../../../../types/CommentChildrenSummary';
import { useSession } from 'next-auth/react';
import { Comment } from '../../../../types/Comment';
import { fetchFromGetAPI, insertToPostAPI } from '../../../../libs/api-interactions';
import { usePictureModal } from '../PictureModalContext';
import CommentList from '../../../activity/comment/comment-list/CommentList';
import CommentForm from '../../../activity/comment/comment-form/CommentForm';
import ContentSummary from '../../../activity/content-summary/ContentSummary';
import ReactionsBar from '../../../activity/reaction/reactions-bar/ReactionsBar';
import { Picture } from '../../../../types/Picture';
import LoadingIcon from '../../../plugins/loading-icon/LoadingIcon';
interface PictureInteractionPanelProps {
    author: UserInClient;
    picture: Picture;
}

const PictureInteractionPanel: React.FC<PictureInteractionPanelProps> = ({picture, author}) => {
    const {profilePicturePaths} = usePictureModal();
    const [reactionsGroups, setReactionsGroups] = useState([]);
    const [reactedUsernames, setReactedUsernames] = useState<string[]>([]); //TODO: fetch reacted usernames from server
    const [isCommenting, setIsCommenting] = useState(false);
    const [isFetchingComments, setIsFetchingComments] = useState(false);
    const [isFetchingReactions, setIsFetchingReactions] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]); //TODO: fetch comments from server
    const [commentorToAvatar, setCommentorToAvatar] = useState<UsernameToProfilePicturePathMap>({}); //TODO: fetch comments from server
    const [commentChildrenSummary, setCommentChildrenSummary] = useState<CommentChildrenSummary>({});
    const {data:session} = useSession();
    const user = session?.user;
    const myUsername =  user?.username || '';
    const loading = isFetchingComments && isFetchingReactions;
    const optimisticCommentInsertion = (comment: Comment) => {
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
        try{
            const response = await fetchFromGetAPI(path, params);
            if(response.success){
                setComments(response.data.result);
                response.data.commentors.length > 0 && handleFetchProfilePathsToCommentors(response.data.commentors);
                setCommentChildrenSummary(response.data.children);
                
            }
        }catch(err){
            console.log(err);
        }finally{
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
        if(picture){
            handleFetchReactionsGroups(picture._id?.toString() || '');
            handleFetctCommentsForPost('', picture._id?.toString() || '');
        }
    },[picture])
    return (
        <div className={`${style['picture-interaction-panel']}`}>
            {loading ? <div className={style["loading"]}>
                <LoadingIcon />
            </div>
            :
            <>
            <UserMiniProfile user={
                {
                    username: author.username,
                    name: author.firstName + ' ' + author.lastName,
                    profilePicturePath: author.profilePicturePath
                }
            } subInfo={author.location?.city} theme={'dark'} />
            
            <div className="text-white mt-4">
                <ContentSummary>
                        <ReactionsBar 
                            reactionsGroups={reactionsGroups}
                            usernames={reactedUsernames}
                            targetId={picture._id?.toString() || ''}
                            />
                        <div className="comment-summary">
                            {comments.length > 0 ? `${comments.length} comments` : 'No comments'}
                        </div>
                    </ContentSummary>
                <InteractionsBtns 
                    targetId={picture._id?.toString() || ''}
                    username={author.username}
                    variant="extended"
                    canComment={true}
                    handleCommentBtnClick={handleCommentBtnClick}
                    targetType='pictures'
                />
            </div>
            {comments && comments.length > 0 && <CommentList 
                 scrollable={false}
                 daChildren={commentChildrenSummary} commentor={myUsername} comments={comments} commentorToAvatarMap={commentorToAvatar} />}
                <CommentForm 
                    _id={picture._id?.toString()!}
                    targetType="pictures"
                    username={myUsername}  
                    isCommenting={isCommenting} 
                    scrollToCommentForm={handleScrollToForm} 
                    targetId={""} 
                    postId={picture._id?.toString()!} 
                    userProfilePicturePath={profilePicturePaths[myUsername]}
                    setIsCommenting={setIsCommenting}
                    optimisticCommentInsertion={optimisticCommentInsertion}
                    />
                </>    
                }
            
        </div>
    );
};

export default PictureInteractionPanel;