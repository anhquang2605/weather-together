import React, { useContext, createContext } from 'react';
import { UserCloud } from '../../../widgets/tagged-user-cloud/TaggedUserCloud';
interface PostFormProviderProps{
    children: React.ReactNode,
}
export interface PostFormContextType{
    taggedUserClouds: Set<UserCloud>,
    setTaggedUsernames: React.Dispatch<React.SetStateAction<Set<UserCloud>>>,
    addTaggedUsername: (taggedUser: UserCloud) => void,
    removeTaggedUsername: (taggedUser: UserCloud) => void,
    getTaggedUsernames: () => string[],
}
export const PostFormContext = createContext<PostFormContextType|undefined>(
   undefined
);

export function PostFormProvider ({children}:PostFormProviderProps) {
    const [taggedUserClouds, setTaggedUsernames] = React.useState<Set<UserCloud>>(new Set());
    const addTaggedUsername = (taggedUser: UserCloud) => {
        const newSet = new Set(taggedUserClouds);
        newSet.add(taggedUser);
        setTaggedUsernames(newSet);
    }
    const removeTaggedUsername = (taggedUser: UserCloud) => {
        taggedUserClouds.delete(taggedUser);
        setTaggedUsernames(new Set(taggedUserClouds));
    }
    const getTaggedUsernames = () => {
        return Array.from(taggedUserClouds).map((user) => user.username);
    }
    return (
        <PostFormContext.Provider value={{
            taggedUserClouds,
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