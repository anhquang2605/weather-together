import style from './notification-list.module.css'
import { Notification } from './../../../../types/Notifications'
import { useEffect, useRef, useState } from 'react';
import { formatDistance } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface NotificationListProps {
    notifications: Notification[];
}
const profilePictureDimension = 72;
export default function NotificationList({ notifications }: NotificationListProps) {
    const [mapOfProfilePicturePaths, setMapOfProfilePicturePaths] = useState(null);
    const route = useRouter();
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
    const handleNotificationsListJSX = () => notifications.map((notification) => {
        return(
            <div key={notification._id}className={style['notification-list-item']} onClick={()=>{
                navigateToLocation(notification.reference_id, notification.type)
            }}>
                <div className={style["user-profile-picture"]}>
                    <Image width={profilePictureDimension} height={profilePictureDimension} src={mapOfProfilePicturePaths?.[notification.username] || "/default"} alt="user profile picture"/>
                </div>
                <div className={style['right-group']}>   
                    <span className={style['notification-list-item__title']}>
                        {notification.title}
                    </span>
                    <span className={style['notification-list-item__time']}>
                        {formatDistance(new Date(notification.createdDate), new Date(), { addSuffix: true })}
                    </span>
                </div>
              
            </div>
        )
    })

    useEffect(() => {
        const listOfUsernames = notifications.map((notification) => notification.username);
        const usernames =[...new Set( listOfUsernames) ];
        fetch('/api/user/post-user-profile-picture-paths',{
            method: 'POST',
            body: JSON.stringify({usernames}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json()).then((data) => {
            setMapOfProfilePicturePaths(data);
        })
    }, [notifications])

    return(
        <div className={style['notification-list']}>
            {notifications.length > 0  && mapOfProfilePicturePaths &&
                handleNotificationsListJSX()
            }
        </div>
    )
}