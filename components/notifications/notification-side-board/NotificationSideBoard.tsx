import { useEffect, useRef, useState } from "react";
import { Notification } from "./../../../types/Notifications"
import style from "./notification-side-board.module.css"
import ControlGroup from "./control-group/ControlGroup";
import NotificationList from "./notification-list/NotificationList";
import {IoSunnyOutline} from 'react-icons/io5'
interface NotificationSideBoardProps {
    notifications: Notification[];
    reveal: boolean;
    setReveal: (reveal: boolean) => void;
    notificationBadgeClassName: string;
    loadMore: () => void;
    canLoadMore: boolean;
    loadMoreStatus: 'loading' | 'idle' | 'error';
    filterUnRead: boolean;
    setFilterUnRead: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function NotificationSideBoard({ notifications, reveal, setReveal, notificationBadgeClassName,loadMore, canLoadMore, loadMoreStatus, filterUnRead, setFilterUnRead}: NotificationSideBoardProps) {
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
            <h3 className="flex-grow font-bold text-lg mb-4">Notifications</h3>
            {notifications.length > 0 ?
                <>
                    <button className="hover:text-indigo-300 self-start">View all</button>
                    <ControlGroup filterUnRead={filterUnRead} setFilterUnRead={setFilterUnRead} setAllRead={setAllRead}/>
                    <NotificationList notifications={notifications}/>
                    {canLoadMore && <button disabled={loadMoreStatus === 'loading'} className={"action-btn mt-4 flex flex-row mr-auto ml-auto " + (loadMoreStatus === 'loading'&& " disabled:opacity-50 pointer-event-none hover:none")  }onClick={()=>{loadMore()}}> {loadMoreStatus=== 'loading' && <IoSunnyOutline className="icon animate-spin-slow mr-1"/>} {loadMoreStatus=== 'loading' ? "Loading" : "Load more"}</button>}
                </>
                :
                <div className="text-center w-full">Nothing to see here</div>
            }

        </div>
    )
}