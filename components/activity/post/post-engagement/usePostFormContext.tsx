import React, { useContext, createContext } from 'react';
interface PostFormProviderProps{
    children: React.ReactNode,
}
export interface PostFormContextType{
    taggedUsernames: Set<string>,
    setTaggedUsernames: React.Dispatch<React.SetStateAction<Set<string>>>,
    addTaggedUsername: (taggedUsername: string) => void,
    removeTaggedUsername: (taggedUsername: string) => void,
    getTaggedUsernames: () => string[],
}
export const PostFormContext = createContext<PostFormContextType|undefined>(
   undefined
);

export function PostFormProvider ({children}:PostFormProviderProps) {
    const [taggedUsernames, setTaggedUsernames] = React.useState<Set<string>>(new Set());
    const addTaggedUsername = (taggedUsername: string) => {
        console.log(taggedUsername);
        setTaggedUsernames(taggedUsernames.add(taggedUsername));
    }
    const removeTaggedUsername = (taggedUsername: string) => {
        taggedUsernames.delete(taggedUsername);
        setTaggedUsernames(new Set(taggedUsernames));
    }
    const getTaggedUsernames = () => {
        return Array.from(taggedUsernames);
    }
    return (
        <PostFormContext.Provider value={{
            taggedUsernames,
            setTaggedUsernames,
            addTaggedUsername,
            removeTaggedUsername,
            getTaggedUsernames,
        }}>
            {children}
        </PostFormContext.Provider>
    )
    
        
};

export const usePostFormContext = ():PostFormContextType => {
    const context = useContext(PostFormContext);
    if (context === undefined) {
        throw new Error(
            'usePostFormContext must be used within a PostFormProvider'
        );
    }
    return context;
};