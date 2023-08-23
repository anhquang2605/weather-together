import {createContext} from 'react';

export const FriendsContext = createContext({
    friendUsernames: new Set<string>(),
})