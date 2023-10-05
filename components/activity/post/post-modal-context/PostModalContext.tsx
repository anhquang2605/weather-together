import React, {useEffect, useState, createContext, useContext, ReactNode, useCallback} from 'react';

import PostModal from './post-modal/PostModal';
import { set } from 'lodash';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import Post from '../Post';

type PostModalContextType ={
    setExtraCloseFunction: React.Dispatch<()=>void>;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setPostId: React.Dispatch<React.SetStateAction<string>>;
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

    const [postId, setPostId] = useState<string>('');
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [extraCloseFunction, setExtraCloseFunction] = useState<()=>void>(()=>{});
    const value = {
        setShow,
        setTitle,
        setExtraCloseFunction,
        setPostId
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
        if(postId.length > 0){
            hanleGettingPost(postId);
        }
    }, [postId])
    return (
        <PostModalContext.Provider value={value}>
            {children}
            {<PostModal onClose={onCloseHandler} content={ postContent} show={show} setShow={setShow} title={title}/>}
        </PostModalContext.Provider>
    );
}
export default PostModalContextProvider;