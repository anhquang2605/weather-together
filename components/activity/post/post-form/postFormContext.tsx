import {createContext, useContext, useState} from 'react';

interface PostFormContextType{
    postId: string,
    editMode: boolean,
    setPostId: React.Dispatch<React.SetStateAction<string>>,
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
}

const PostFormContext = createContext<PostFormContextType|null>(null);

interface PostFormContextProviderProps{
    children: React.ReactNode
}

export const PostFormContextProvider: React.FC<PostFormContextProviderProps> = ({children}) => {
    const [postId, setPostId] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const value = {
        postId,
        editMode,
        setPostId,
        setEditMode
    }
    return (
        <PostFormContext.Provider value={value}>
            {children}
        </PostFormContext.Provider>
    )
}
export const usePostFormContext2 = () => {
    const context = useContext(PostFormContext);
    if(context === null){
        throw new Error('usePostFormContext must be used within PostFormContextProvider');
    }
    return context;
}
export default PostFormContext;