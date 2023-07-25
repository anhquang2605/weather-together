import { useState } from "react";
import { Notification } from "./../../../types/Notifications"
import style from "./notification-side-board.module.css"
import ControlGroup from "./control-group/ControlGroup";
import NotificationList from "./notification-list/NotificationList";
interface NotificationSideBoardProps {
    notifications: Notification[];
    unreadNotifications: Notification[];
}
export default function NotificationSideBoard({ notifications,unreadNotifications }: NotificationSideBoardProps) {
    const [filterRead, setFilterRead] = useState(false);
    const setAllRead = () => {

    }
    return(
        <div 
            className= {style['notification-side-board'] }
        >
            <ControlGroup filterRead={filterRead} setFilterRead={setFilterRead} setAllRead={setAllRead}/>
            <NotificationList notifications={filterRead ? unreadNotifications : notifications}/>
        </div>
    )
}