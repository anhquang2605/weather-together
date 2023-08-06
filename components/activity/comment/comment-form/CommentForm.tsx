
import React,{useState, useEffect} from 'react'
import { insertToPostAPI, uploadFileToPostAPI } from '../../../../libs/api-interactions';
import style from './comment-form.module.css';
import MiniAvatar from '../../mini-avatar/MiniAvatar';
import {IoCamera,IoSend} from 'react-icons/io5';
interface ErrorMessage {
    message: string,
    type: string //picture-attachment, content-length
}
interface CommentFormProps {
    targetId: string,//will be "" if comment on post
    username: string,
    targetLevel?: number, //for comment on comment, if none, then the target is a post, whoever call this will have level = target level + 1 but 0 if target is a post
    postId: string,
    isCommenting: boolean,
    setIsCommenting: (isCommenting: boolean) => void,
    userProfilePicturePath: string,
    targetType: string, //posts or comments
}
export default function CommentForm({targetId, username, targetLevel = 0, postId, isCommenting, setIsCommenting, userProfilePicturePath, targetType}: CommentFormProps) {
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [pictureAttached, setPictureAttached] = useState(false);
    const [picture, setPicture] = useState<File>();
    const [previewPictureURL, setPreviewPictureURL] = useState<string | null>('');
    const [errorMessages, setErrorMessages] = useState<ErrorMessage[]>([]);
    const [validContentLength, setValidContentLength] = useState(false); //min should be 1 word
    const [s3PictureURL, setS3PictureURL] = useState<string | null>(null);
    const handlePictureInptChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const reader = new FileReader();
        if(file) {
            //check if file is image
            if(!file.type.startsWith('image')) {
                addToErrorMessages({
                    message: 'File must be an image',
                    type: 'picture-attachment'
                });
            }else{
                reader.onload = () => {
                    if(errorMessages.some(message => message.type.includes('picture'))) {
                        removeFromErrorMessages('picture');
                    }
                    setPicture(file);
                    setPreviewPictureURL(URL.createObjectURL(file));
                    setPictureAttached(true);
                }
                reader.onerror = () => {
                    addToErrorMessages({
                        message: 'Error reading file',
                        type: 'picture-reading'
                    });
                }

            }
        }
    }
    const addToErrorMessages = (message: ErrorMessage) => {
        setErrorMessages(prev => [...prev, message]);
    }
    const removeFromErrorMessages = (type: string) => {
        setErrorMessages(prev => prev.filter(message => message.type.includes('picture')));
    }
    
    const handleResetForm = () => {
        setContent('');
        setPictureAttached(false);
        setPicture(undefined);
        setPreviewPictureURL(null);
    }
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        if(e.target.value.length > 0) {
            setValidContentLength(true);
        }else{
            setValidContentLength(false);
        }
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSending(true);
        let picuterUrl;
        if(picture && pictureAttached) {
            removeFromErrorMessages('picture')
            const formData = new FormData();
            formData.append('file', picture);
            const uploadToS3APIPath= 'upload'
            try{
                const data = await uploadFileToPostAPI(uploadToS3APIPath, formData);
                picuterUrl = data.url;
            }catch(error) {
                addToErrorMessages({
                    type: "picture-upload",
                    message: 'Error uploading file',
                })
            }
        }
        let level;
        if(targetLevel === undefined || targetLevel === null) {
            level = 0;
        }else {
            level = targetLevel + 1;
        }
        //posting comment
        const pathToPostCommentAPI = 'comments/post-comment';
        const comment = {
            content,
            username,
            targetId,
            createdDate: new Date(),
            updatedDate: new Date(),
            targetType,
            level,
            pictureAttached,
            postId,
        }
        //post comment first, then get the comment id, then post picture
        let commentId;
        try{
            commentId = await insertToPostAPI(pathToPostCommentAPI, comment);
        } catch (err){
            addToErrorMessages({
                type: 'comment-posting',
                message: 'Error posting comment',
            })
        }
        //adding picture to post if picture is attached
        if(picture && pictureAttached) {
            const pathToPostPictureAPI = 'pictures/post-picture';
            const mongoPicture = {
                picturePath: picuterUrl,
                createdDate: new Date(),
                targetId: commentId,
                targetType: 'comment',
                username,
            }
            try{
                await insertToPostAPI(pathToPostPictureAPI, mongoPicture);
                
                handleResetForm();
            }catch(err) {0
                addToErrorMessages({
                    type: 'picture-posting',
                    message: 'Error posting picture',
                })
            }
        }
        setIsSending(false); 
    }
    return(
        <div className={style['comment-form']}>
            <MiniAvatar profilePicturePath={userProfilePicturePath} size="large"/>
            <div className={style['text-box']}>
                <textarea className={style['comment-form__content']} placeholder="Write a comment..." value={content} onChange={handleContentChange}></textarea>
                <div className={style['control-group']}>
                    <div className={style['attachment-group']}>
                        <div className={style['image-attachment']}>
                            <label title="Attach a picture" htmlFor="picture-comment-upload" className={style['control-btn']}>
                                <IoCamera className={style['control-icon'] + " icon"}/>
                            </label>
                            <input type="file" accept="image/*" id="picture-comment-upload" className={style['image-attachment__input'] + " hidden"} onChange={handlePictureInptChange}/>
                        </div>
                            
                        
                    </div>
                    <button title="Send" className={style['send-btn'] + " " + style['control-btn'] + " " + (
                        isSending || !validContentLength ? style['disabled'] : ''
                    )}>
                        <IoSend className={style['control-icon'] + " icon"}/>
                    </button>
                </div>
            </div>
            <div className={style['error-diplay']}>

            </div>

        </div>
    )
}

