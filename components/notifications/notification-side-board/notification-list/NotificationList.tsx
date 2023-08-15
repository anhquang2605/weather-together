import style from './notification-list.module.css'
import { Notification } from './../../../../types/Notifications'
import { useEffect, useState, useContext } from 'react';
import { NotificationContext } from './../../NotificationContext';
import { formatDistance } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {IoCheckmark, IoClose, IoEllipsisVertical} from 'react-icons/io5'
import DefaultProfilePicture from '../../../profile/default-profile-picture/DefaultProfilePicture';
import MiniAvatar from '../../../activity/mini-avatar/MiniAvatar';
interface NotificationListProps {
    notifications: Notification[];
    handleSetRead:  (notification_id: string, index: number) => void;
    handleDeleteOneNotification: (notification_id: string, index: number) => void;
    setReveal: (reveal: boolean) => void;
}
const profilePictureDimension = 72;
export default function NotificationList({ notifications, handleDeleteOneNotification, handleSetRead, setReveal }: NotificationListProps) {
    const [mapOfProfilePicturePaths, setMapOfProfilePicturePaths] = useState(null);
    const {loadingNotification, limit, fetching, unreads} = useContext(NotificationContext)
    const route = useRouter();
    const generateNotificationListLoadingSkeletonJSX = () => {
        const jsx = [];
        const len = (unreads > 0 && unreads < limit) ? unreads : limit;
        for (let index = 0; index < len; index++) {
            jsx.push(
                <div key={index} className={style["list-item-skeletal-container"]}>
                    <div className={style["profile-picture-skeletal"]}></div>
                    <div className={style["content-skeletal"]}>
                        <div className={style["content-skeletal-title"]}></div>
                        <div className={style["content-skeletal-timestamp"]}></div>
                    </div>
                </div>
            )
        }
        return jsx;
    }
    const listLoadingSkeletalJSX = generateNotificationListLoadingSkeletonJSX();
    const navigateToLocation = (reference_id: string = "", type: string) => {
        switch(type){
            case 'comment':
                route.push(`/post/${reference_id}`);
                break;
            case 'friend_request':
                route.push(`/user/${reference_id}`);
                break;
            case 'reaction':
                route.push(`/post/${reference_id}`);
                break;
            case 'post':
                route.push(`/post/${reference_id}`);
                break;
            default:
                break;
        }
    }
    const handleNotificationsListJSX = () => notifications.map((notification,index) => {
        return(
            <div key={notification._id}
                className={
                        style['notification-list-item'] 
                        + (notification.read ? (" " + style.read) : "")
                        + (loadingNotification.has(index) ? (" " + style['loading-notification']) : "")  
                } 
                onClick={(e)=>{
                    e.stopPropagation();
                    if(notification.read === false) handleSetRead(notification?._id as string, index)
                    setReveal(false);
                    navigateToLocation(notification.reference_id, notification.type)
                }
            }>
              
                    <MiniAvatar 
                        className="mr-2"
                        profilePicturePath={mapOfProfilePicturePaths?.[notification.sender_username] ?? ""}
                        size="large"
                        username={notification.sender_username}
                    />
                <div className={style['right-group']}>   
                    <span className={style['notification-list-item__title']}>
                        {notification.title}
                    </span>
                    <span className={style['notification-list-item__time']}>
                        {formatDistance(new Date(notification.createdDate), new Date(), { addSuffix: true })}
                    </span>
                </div>
                <div className={style["hover-control-btn-group"]}>
                        {!notification.read && 
                        <button 
                            className="text-green-600 hover:bg-green-600 hover:text-white" title="Mark as Read"
                            onClick={(e)=>{
                                e.stopPropagation();
                                handleSetRead(notification?._id as string, index)
                            }}
                        >
                                <IoCheckmark/>
                        </button>}
                        <button 
                            className="text-red-600 hover:bg-red-600 hover:text-white" 
                            title="Remove"
                            onClick={(e)=>{
                                e.stopPropagation();
                                handleDeleteOneNotification(notification?._id as string, index)
                            }}
                        >
                            <IoClose/>
                        </button>
                    
                </div>
                {!notification.read && <div className={style['read-indicator']}></div>}
            </div>
        )
    })

    useEffect(() => {
        if(notifications.length === 0) return;
        var notificationInnerContainer = document.querySelector(`.${style['notification-list']}`);
        if(notificationInnerContainer){
            notificationInnerContainer.scrollTo({
                top: notificationInnerContainer.scrollHeight,
                behavior: "smooth"
            })
        }
        const listOfUsernames = notifications.map((notification) => notification.sender_username);
        const usernames =[...new Set( listOfUsernames) ];
        fetch('/api/users',{
            method: 'POST',
            body: JSON.stringify(usernames),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json()).then(data => {
            if(data.success){
                setMapOfProfilePicturePaths(data.data)
            }
        })
    }, [notifications])
    return(  
            fetching ? 
            listLoadingSkeletalJSX 
            :
            <div id='notification-list-container' className={style['notification-list']}>
                {notifications.length > 0  && mapOfProfilePicturePaths &&
                    handleNotificationsListJSX()
                }
            </div>
    )
}