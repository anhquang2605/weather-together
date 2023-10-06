import React, {useEffect, useState, createContext, useContext, ReactNode, useCallback} from 'react';

import PostModal from './post-modal/PostModal';
import { set } from 'lodash';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import Post from '../Post';
import { Emoji } from '../../../../types/Emoji';

type PostModalContextType ={
    setExtraCloseFunction: React.Dispatch<()=>void>;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setCurPostId: React.Dispatch<React.SetStateAction<string>>;
    commentFormState: CommentFormState;
    setCommentFormState: React.Dispatch<React.SetStateAction<CommentFormState>>;
    curPostId: string;
    show:boolean;
}
export interface CommentFormState {
    content: string,
    picture: File | undefined,
    pictureAttached: boolean,
    previewPictureURL: string,
    previewRatio: number,
    previewPictureDimensions: number[],
    errorMessages: ErrorMessage[],
    validContentLength: boolean,
    currentCursorPosition: number,
    suggestions: Emoji[],
    revealEmojiSuggestions: boolean,
    emojiSuggestionTerm: string,
}
interface ErrorMessage {
    message: string,
    type: string //picture-attachment, content-length
}
interface PostModalContextProps {
    children: React.ReactNode;
}

const PostModalContext = createContext<PostModalContextType>({} as PostModalContextType);

export function usePostModalContext(){
    const context = useContext(PostModalContext);
    if(!context){
        throw new Error("usePostModalContext must be used within PostModalContextProvider");
    }
    return useContext(PostModalContext);
}

const PostModalContextProvider: React.FC<PostModalContextProps> = ({children}) => {
    const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle'); //TODO: fetch the post from server
    const [postContent, setPostContent] = useState<ReactNode | null>(null);
    const [commentFormState, setCommentFormState] = useState<CommentFormState>({
        content: '',
        picture: undefined,
        pictureAttached: false,
        previewPictureURL: '',
        previewRatio: 0,
        previewPictureDimensions: [0, 0],
        errorMessages: [],
        validContentLength: false,
        currentCursorPosition: 0,
        suggestions: [],
        revealEmojiSuggestions: false,
        emojiSuggestionTerm: ''
    } as CommentFormState);
    const [curPostId, setCurPostId] = useState<string>('');
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [extraCloseFunction, setExtraCloseFunction] = useState<()=>void>(()=>{});
    const value = {
        setShow,
        setTitle,
        setExtraCloseFunction,
        commentFormState,
        setCommentFormState,
        curPostId,
        show,
        setCurPostId
    }
    const handleReset = () => {
        setTitle('');
    }
   
    const onCloseHandler = useCallback(()=>{
        setShow(false);
        handleReset();
        if(extraCloseFunction){
            extraCloseFunction();
        }
    }, [extraCloseFunction])
    const hanleGettingPost = async (postId: string) => {
        setPostContent(null);//prevent the cached post from haunting the modal briefly before the new post is fetched
        setFetchStatus('loading');
        try{
            const path = "posts";
            const params = {
                _id: postId
            }
            const response = await fetchFromGetAPI(path, params);
            if(response.success){
                const postJSX = <Post post={response.data} preview={false} username={response.data.username}></Post>;
                setPostContent(postJSX);
                setFetchStatus('success');
            }else{
                setFetchStatus('error');
            }
        }catch(err){
            setFetchStatus('error');
        }
    }
    useEffect(() => {
        if(curPostId.length > 0){
            hanleGettingPost(curPostId);
        }
    }, [curPostId])
    return (
        <PostModalContext.Provider value={value}>
            {children}
            {<PostModal onClose={onCloseHandler} content={ postContent} show={show} setShow={setShow} title={title}/>}
        </PostModalContext.Provider>
    );
}
export default PostModalContextProvider;