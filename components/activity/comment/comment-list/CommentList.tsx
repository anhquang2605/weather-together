import React, {useEffect, useRef} from 'react';
import style from './comment-list.module.css';
import { Comment } from '../../../../types/Comment';
import { UsernameToProfilePicturePathMap } from '../../UsernameToProfilePicturePathMap';
import CommentComponent from '../CommentComponent';
import { CommentChildrenSummary } from '../../../../types/CommentChildrenSummary';
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
}

const CommentList: React.FC<CommentListProps> = ({comments, commentorToAvatarMap, commentor, children, topLevelListContainer, scrollable, usernamesToNames,waterFall, curLevel, postID}) => {
    const commentListRef = topLevelListContainer ?? useRef<HTMLDivElement| null>(null)
    const commentsJSX = 
        () => {
            if(waterFall){
                let comment = comments[curLevel || 0];
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
            if(postID && !waterFall){
                const option = {
                    root: document.querySelector(`#${postID}`),
                }
                const target = document.querySelector(`#${postID} .${style['lazy-target']}`)
                const observer = new IntersectionObserver((entries)=>{
                    entries.forEach(entry => {
                        if(entry.isIntersecting){
                            console.log('intersecting')
                        }
                    })
                })
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
            {!waterFall && <div className={style['lazy-target']}>

            </div>}
        </div>
        :
        <div className={style['empty-comment-list']}>
            <p>No comment yet, be the first!</p>
        </div>
    );
};

export default CommentList;