import React, {useEffect, useState, createContext, useContext, ReactNode, useCallback} from 'react';

import PostModal from './post-modal/PostModal';
import { set } from 'lodash';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import { Post as PostType } from '../../../../types/Post';
import { Emoji } from '../../../../types/Emoji';
import Post from '../Post';
import LoadingBox from '../../../skeletons/loading-box/LoadingBox';

type PostModalContextType ={
    //setExtraCloseFunction: React.Dispatch<()=>void>;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setCurPostId: React.Dispatch<React.SetStateAction<string>>;
    commentFormState: CommentFormState;
    setCommentFormState: React.Dispatch<React.SetStateAction<CommentFormState>>;
    curPostId: string;
    show:boolean;
    setExtraCloseFunction: React.Dispatch<React.SetStateAction<()=>void>>;
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
    return context;
}
interface PostData {
    post: PostType | null,
    username: string
}
const PostModalContextProvider: React.FC<PostModalContextProps> = ({children}) => {
    const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle'); //TODO: fetch the post from server
    const [post, setPost] = useState<PostType | null>(null);
    const [extraCloseFunction, setExtraCloseFunction] = useState<()=>void>(()=>{});
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
    //const [extraCloseFunction, setExtraCloseFunction] = useState<()=>void>(()=>{});
    const value = {
        setShow,
        setTitle,
        //setExtraCloseFunction,
        commentFormState,
        setCommentFormState,
        curPostId,
        show,
        setCurPostId,
        setExtraCloseFunction
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

    const handleGettingPost = async (postId: string) => {
       //prevent the cached post from haunting the modal briefly before the new post is fetched
        setFetchStatus('loading');
        try{
            const path = "posts";
            const params = {
                postId
            }
            const response = await fetchFromGetAPI(path, params);
            if(response.success){
                setPost(response.data);
                setFetchStatus('success');
            }else{
                setFetchStatus('error');
            }
        }catch(err){
            setFetchStatus('error');
        }
    }
    useEffect(() => {
        if(curPostId !== ''){
            handleGettingPost(curPostId);
        }
    }, [curPostId])
    return (
        <PostModalContext.Provider value={value}>
            {children}
            {show && <PostModal onClose={onCloseHandler} show={show} setShow={setShow} title={title}>
                { 
                    post && fetchStatus === "success" ? <Post post={post} preview={false}></Post>
                    :
                    <LoadingBox variant='large' long={true}/>
                }
             </PostModal>
            }
        </PostModalContext.Provider>
    );
}
export default PostModalContextProvider;