import React, { useContext, createContext } from 'react';

import { BuddyTag } from '../post-form/friend-tag-form/BuddyTagForm';
import { set } from 'lodash';
import { Buddy } from '../../../../types/User';

interface PostFormProviderProps{
    children: React.ReactNode,
}
export interface PostFormContextType{
    taggedBuddys: Set<BuddyTag>,
    lastItemRemoved: string,
    lastItemAdded: string,
    addTimestamp: Date,
    removeimestamp: Date,
    actionType: string,
    reset: () => void,
    setTaggedUsernames: React.Dispatch<React.SetStateAction<Set<BuddyTag>>>,
    addTaggedUsername: (taggedUser: BuddyTag) => void,
    removeTaggedUsername: (taggedUser: BuddyTag) => void,
    getTaggedUsernames: () => string[],
    addTaggedBuddies: (taggedBuddies: BuddyTag[]) => void,
    getUniquePostId: (post:string) => string,
    getUsernameSet: () => Set<string>,

    
}
export const PostFormContext = createContext<PostFormContextType|undefined>(
   undefined
);

export function PostFormProvider ({children}:PostFormProviderProps) {
    const [addTimestamp, setAddTimestamp] = React.useState<Date>(new Date()); // timestamp of the last item added to the taggedBuddys
    const [removeimestamp, setRemoveTimestamp] = React.useState<Date>(new Date()); // timestamp of the last item removed from the taggedBuddys
    const [lastItemAdded, setLastItemAdded] = React.useState<string>(""); // last item added to the taggedBuddys [username]
    const [lastItemRemoved, setLastItemRemoved] = React.useState<string>(""); // last item removed from the taggedBuddys [username]
    const [taggedBuddys, setTaggedUsernames] = React.useState<Set<BuddyTag>>(new Set());
    const [actionType, setActionType] = React.useState<string>(""); // action to perform on the buddy list [add, remove
    const addTaggedUsername = (taggedUser: BuddyTag) => {
        setActionType('add');
        const newSet = new Set(taggedBuddys);
        newSet.add(taggedUser);
        setLastItemAdded(taggedUser.friendUsername);
        setTaggedUsernames(newSet);
        setAddTimestamp(new Date());
    }
    const addTaggedBuddies = (taggedBuddies: BuddyTag[]) => {
        setActionType('add');
        const newSet = new Set(taggedBuddies);
        taggedBuddies.forEach((buddy) => {
            buddy.tagged = true;
            newSet.add(buddy);
        })
        setTaggedUsernames(newSet);
        setAddTimestamp(new Date());
    }
    const removeTaggedUsername = (taggedUser: BuddyTag) => {
        setActionType('remove');
        const newSet = new Set(taggedBuddys)
        newSet.delete(taggedUser);
        setTaggedUsernames(new Set(newSet));
        setLastItemRemoved(taggedUser.friendUsername);
        setRemoveTimestamp(new Date());
    }
    const reset = () => {
        setTaggedUsernames(new Set());
        setAddTimestamp(new Date());
        setRemoveTimestamp(new Date());
        setLastItemAdded("");
        setLastItemRemoved("");
        setActionType("");
    }
    const hasUserBeenTagged = (username: string) => {
        return Array.from(taggedBuddys).some((buddy) => buddy.friendUsername === username);
    }
    const getUniquePostId = (post:string) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < 10; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return post + result;
    }
    const getUsernameSet = () => {
        let buddies = Array.from(taggedBuddys).map((buddy) => buddy.friendUsername);
        let simpleBuddySet = new Set(buddies);
        return simpleBuddySet;
    }
    const getTaggedUsernames = () => {
        return Array.from(taggedBuddys).map((user) => user.friendUsername);
    }
    return (
        <PostFormContext.Provider value={{
            removeimestamp,
            addTimestamp,
            lastItemRemoved,
            lastItemAdded,
            taggedBuddys,
            setTaggedUsernames,
            addTaggedUsername,
            removeTaggedUsername,
            getTaggedUsernames,
            actionType,
            reset,
            addTaggedBuddies,
            getUniquePostId,
            getUsernameSet,
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