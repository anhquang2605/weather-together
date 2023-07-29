import { createContext } from 'react';

export const NotificationContext = createContext({
    loadingNotification: new Set<number>(),
});