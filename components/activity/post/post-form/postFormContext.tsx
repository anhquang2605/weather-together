import {createContext, useContext, useState} from 'react';

interface PostFormContextType{
    postId: string,
    editMode: boolean,
    setPostId: React.Dispatch<React.SetStateAction<string>>,
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
}
export const PostFormContext = createContext<PostFormContextType|undefined>(undefined);

interface PostFormContextProviderProps{
    children: React.ReactNode
}

export function PostFormContextProvider ({children}:PostFormContextProviderProps) {
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
export const usePostFormContext2 = ():PostFormContextType => {
    const context = useContext(PostFormContext);
    if(context === undefined){
        throw new Error('usePostFormContext must be used within PostFormContextProvider');
    }
    return context;
}