import React, { useContext, createContext } from 'react';

import { BuddyTag } from '../post-form/friend-tag-form/BuddyTagForm';

interface PostFormProviderProps{
    children: React.ReactNode,
}
export interface PostFormContextType{
    taggedBuddys: Set<BuddyTag>,
    lastItemRemoved: string,
    setTaggedUsernames: React.Dispatch<React.SetStateAction<Set<BuddyTag>>>,
    addTaggedUsername: (taggedUser: BuddyTag) => void,
    removeTaggedUsername: (taggedUser: BuddyTag) => void,
    getTaggedUsernames: () => string[],
    actionType: string,
}
export const PostFormContext = createContext<PostFormContextType|undefined>(
   undefined
);

export function PostFormProvider ({children}:PostFormProviderProps) {
    const [lastItemRemoved, setLastItemRemoved] = React.useState<string>(""); // last item removed from the taggedBuddys [username]
    const [taggedBuddys, setTaggedUsernames] = React.useState<Set<BuddyTag>>(new Set());
    const [actionType, setActionType] = React.useState<string>(""); // action to perform on the buddy list [add, remove
    const addTaggedUsername = (taggedUser: BuddyTag) => {
        setActionType('add');
        const newSet = new Set(taggedBuddys);
        newSet.add(taggedUser);
        setTaggedUsernames(newSet);
    }
    const removeTaggedUsername = (taggedUser: BuddyTag) => {
        setActionType('remove');
        taggedBuddys.delete(taggedUser);
        setTaggedUsernames(new Set(taggedBuddys));
        setLastItemRemoved(taggedUser.username);
    }
    const getTaggedUsernames = () => {
        return Array.from(taggedBuddys).map((user) => user.username);
    }
    return (
        <PostFormContext.Provider value={{
            lastItemRemoved,
            taggedBuddys,
            setTaggedUsernames,
            addTaggedUsername,
            removeTaggedUsername,
            getTaggedUsernames,
            actionType
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