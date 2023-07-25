import { Notification } from './../types/Notifications';
export function getNotificationsUnread(notifications: Notification[]){
    return notifications.filter((notification) => notification.read === false);
}