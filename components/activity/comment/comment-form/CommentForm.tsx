import { error } from 'console';
import { add, remove } from 'lodash';
import React,{useState, useEffect} from 'react'
import { insertToPostAPI, uploadFileToPostAPI } from '../../../../libs/api-interactions';
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
    targetType: string,
    setIsCommenting: (isCommenting: boolean) => void,
}
export default function CommentForm({targetId, username, targetLevel = 0, postId, isCommenting, setIsCommenting, targetType}: CommentFormProps) {
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [pictureAttached, setPictureAttached] = useState(false);
    const [picture, setPicture] = useState<File>();
    const [previewPictureURL, setPreviewPictureURL] = useState<string | null>('');
    const [errorMessages, setErrorMessages] = useState<ErrorMessage[]>([]);
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
        }catch(err) {
            addToErrorMessages({
                type: 'picture-posting',
                message: 'Error posting picture',
            })
        }finally{
            setIsSending(false);
        }
        
        //then upload the comment 
        
    }
}

