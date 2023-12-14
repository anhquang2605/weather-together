import {createContext, useContext, useState} from 'react';

interface PostFormContextType2{
    postId: string,
    editMode: boolean,
    setPostId: React.Dispatch<React.SetStateAction<string>>,
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
}
export const PostFormContext2 = createContext<PostFormContextType2|undefined>(undefined);

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
        <PostFormContext2.Provider value={value}>
            {children}
        </PostFormContext2.Provider>
    )
}
export const usePostFormContext2 = ():PostFormContextType2 => {
    const context = useContext(PostFormContext2);
    if(context === undefined){
        throw new Error('usePostFormContext must be used within PostFormContextProvider');
    }
    return context;
}