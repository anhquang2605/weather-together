import { createContext } from 'react';

export const NotificationContext = createContext({
    loadingNotification: new Set<number>(),
    limit: 5,
    fetching: false,
    unreads: 0,
});