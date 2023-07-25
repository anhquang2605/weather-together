import { useEffect, useRef, useState } from "react";
import { Notification } from "./../../../types/Notifications"
import style from "./notification-side-board.module.css"
import ControlGroup from "./control-group/ControlGroup";
import NotificationList from "./notification-list/NotificationList";
interface NotificationSideBoardProps {
    notifications: Notification[];
    unreadNotifications: Notification[];
    reveal: boolean;
    setReveal: (reveal: boolean) => void;
    notificationBadgeClassName: string;
}
export default function NotificationSideBoard({ notifications,unreadNotifications,reveal, setReveal, notificationBadgeClassName }: NotificationSideBoardProps) {
    const [filterRead, setFilterRead] = useState(false);
    const listBoardRef = useRef<HTMLDivElement | null>(null);
    const setAllRead = () => {

    }
    const handleClickOutside = (e:MouseEvent) => {
        e.stopPropagation();
        const notificationBadge = document.querySelector(`.${notificationBadgeClassName}`) as HTMLElement;
        //outside of the notification side board but include the notifcation button
        if(listBoardRef.current && !listBoardRef.current.contains(e.target as Node)){
            if(!notificationBadge || !notificationBadge.contains(e.target as Node)){
                setReveal(false)
            }
        }
     }
    useEffect(()=>{
        //handle clicking outside of the notification side board
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    },[])
    return(
        <div 
        ref={listBoardRef}
            className= {style['notification-side-board'] + " p-4 " + (reveal? "" : style["hide-drop"]) }
        >
            <ControlGroup filterRead={filterRead} setFilterRead={setFilterRead} setAllRead={setAllRead}/>
            <NotificationList notifications={filterRead ? unreadNotifications : notifications}/>
        </div>
    )
}