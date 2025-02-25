import React, {useEffect, useRef} from 'react';
import style from './comment-list.module.css';
import { Comment } from '../../../../types/Comment';
import { UsernameToProfilePicturePathMap } from '../../UsernameToProfilePicturePathMap';
import CommentComponent from '../CommentComponent';
import { CommentChildrenSummary } from '../../../../types/CommentChildrenSummary';
import LoadingIndicator from '../../../loading-indicator/LoadingIndicator';
interface CommentListProps {
    comments : Comment[];
    commentorToAvatarMap: UsernameToProfilePicturePathMap;
    commentor: string;
    children: CommentChildrenSummary;
    topLevelListContainer?: React.MutableRefObject<HTMLDivElement | null>;
    scrollable: boolean;
    usernamesToNames?: {[username: string]: string};
    waterFall?: boolean;
    curLevel?: number;
    postID?: string;
    setEndOfList?: React.Dispatch<React.SetStateAction<boolean>>;
    fetchingMoreCommentStatus?: string;
}

const CommentList: React.FC<CommentListProps> = ({comments, commentorToAvatarMap, commentor, children, topLevelListContainer, scrollable, usernamesToNames,waterFall, curLevel, postID, setEndOfList, fetchingMoreCommentStatus}) => {
    const commentListRef = topLevelListContainer ?? useRef<HTMLDivElement| null>(null)
    const commentsJSX = 
        () => {
            if(waterFall){
                let comment = comments[curLevel || 0];
                console.log(commentorToAvatarMap, comment.username);
                return(
                    [<CommentComponent
                        key={comment._id?.toString() || ''}
                        comment={comment}
                        profilePicturePath={commentorToAvatarMap[comment.username]}
                        commentorUsername={commentor}
                        commentListRef={commentListRef}
                        usernamesToNames={usernamesToNames || {}}
                        childrenNo={children[comment._id?.toString() || '']}
                        lastChild={true}
                        waterFallComments={comments}
                        waterFall={waterFall}
                        curLevel={curLevel || 0}
                        childrenSummaryWaterFall={children}
                    />]
                )
            }else{
                return comments.map((comment, index) => {
                    return(
                        <CommentComponent
                            key={index}
                            comment={comment}
                            profilePicturePath={commentorToAvatarMap[comment.username]}
                            commentorUsername={commentor}
                            commentListRef={commentListRef}
                            usernamesToNames={usernamesToNames || {}}
                            childrenNo={children[comment._id?.toString() || '']}
                            lastChild={index === comments.length - 1}
                            
                        />
                    )
                })
            }
           
        }
        useEffect(()=>{
            if(postID && !waterFall){//observe the comment list
                const option = {
                    root: document.querySelector(`#${postID}`),
                }
                const target = document.querySelector(`#${postID + '_lazy-target'}`)
                const observer = new IntersectionObserver((entries)=>{
                    for (let entry of entries) {
                        if(entry.isIntersecting){
                            if(setEndOfList){
                                setEndOfList(true)
                            }
                        }
                    }
                }, option)
                if(target){
                    observer.observe(target)
                }
                return ()=>{
                    if(target){
                        observer.unobserve(target)
                    }
                }
            }
        },[])
    return (
        comments &&  comments.length > 0 ?
        <div ref={topLevelListContainer ? null : commentListRef } className={`${style['comment-list']} ${scrollable && style['scroll']} ${!topLevelListContainer && style['top-level']}`}>

            <div className={style['edge-passing-child']}>

            </div>
            {comments && commentsJSX()}
            {!waterFall && <div id={postID + '_lazy-target'} className={style['lazy-comment-target']}>

            </div>}
            {
                fetchingMoreCommentStatus === 'loading' &&
                <LoadingIndicator/>
            }
            {
                fetchingMoreCommentStatus === 'error' &&
                <div className="text-red-500 font-semibold text-center w-full py-16">
                    <p>Failed to fetch more comments</p>
                </div>
            }
        </div>
        :
        <div className={style['empty-comment-list']}>
            <p>No comment yet, be the first!</p>
        </div>
    );
};

export default CommentList;