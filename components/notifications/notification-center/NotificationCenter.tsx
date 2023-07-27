import {useState, useEffect, use, useRef} from 'react'
import style from './notification-center.module.css'
import {IoNotifications} from 'react-icons/io5'
import { Notification } from '../../../types/Notifications';
import NotificationSideBoard from '../notification-side-board/NotificationSideBoard';
import { useSession } from 'next-auth/react';
import { getNotificationsUnread } from '../../../libs/notifications';
import { set } from 'mongoose';
export function getServerSideProps() {
    
    return {
      props: {}, // will be passed to the page component as props
    }
  }
export default function NotificationCenter(){
    const [reveal, setReveal] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
    const {data:session} = useSession();
    const user = session?.user;
    const PORT = process.env.NEXT_PUBLIC_WS_SERVER_PORT;
    const SERVER_HOST = process.env.NEXT_PUBLIC_WS_SERVER_HOST;
    const socket = useRef<WebSocket | null>(null);
    const setNotificationsFromServer = (notifications: Notification[]) => {
        const unreads= getNotificationsUnread(notifications);
        setNotifications(notifications);
        setUnreadNotifications(unreads);
    }
    const handleUpdateNotificationStates = (index: number, del: boolean) => {
        setUnreadNotifications((prev) => {
            const newUnread = [...prev];
            newUnread.splice(index, 1);
            return newUnread;
        })
        if(del){
            setNotifications((prev) => {//remove from notifications
                const newNotifications = [...prev];
                newNotifications.splice(index, 1);
                return newNotifications;
            })
        } else {//set read to a notification
            setNotifications((prev) => {
                const newNotifications = [...prev];
                newNotifications[index].read = true;
                return newNotifications;
            })
        }
    }
    const handleSetRead = (notification_id: string, index: number) => {
        fetch(`/api/notification/put-notification-read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: notification_id?.toString(),
            })
        }).then(res => res.json()).then(data => {
            if(data.success){
                handleUpdateNotificationStates(index, false);
            }
        })
    }
    const handleSetAllRead = () => {
        fetch(`/api/notification/put-all-notifications-read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user?.username?.toString(),
            })
        }).then(res => res.json()).then(data => {
            if(data.success){
                setUnreadNotifications([]);
                setNotifications((prev) => {
                    const newNotifications = [...prev];
                    newNotifications.forEach((notification) => {
                        notification.read = true;
                    })
                    return newNotifications;
                })
            }
        })
    }
    const handleDeleteNotification = (notification_id: string, index: number) => {
        fetch(`/api/notification/delete-notification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: notification_id?.toString(),
            })
        }).then(res => res.json()).then(data => {
            if(data.success){
                handleUpdateNotificationStates(index, true);
            }
        })
    }
    useEffect(() => {
        fetch(`/api/notification/get-limited-notifications?username=${user?.username}&limit=10`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(data => {
           setNotificationsFromServer(data);
        })
        const ws = new WebSocket(`${SERVER_HOST}:${PORT}`);
        ws.onopen = () => {
          ws.send(JSON.stringify({
            type: 'username',
            package: 'notifications',
            username: user?.username,
          }));
        
        }
        ws.onmessage = (message) => {
          const payload = JSON.parse(message.data);
            if(payload.type === 'notification-added'){
                console.log(payload.data)
                setNotifications((prev) => [...prev, payload.data]);
                setUnreadNotifications((prev) => [...prev, payload.data]);            
            } 
        socket.current = ws ;
  /*           const change =  JSON.parse(message.data);
            console.log(message.data);
            setUser(change.data); */
        }
        return () => {
            ws.close();
        }
    },[])
    useEffect(() => {
        setUnreadNotificationsCount(unreadNotifications.length);
    },[unreadNotifications])
    return(
        <div
            className={style['notification-center'] + " mt-4 mr-4  " + (reveal ? style['reveal'] : "") + (unreadNotificationsCount > 0 ? " " + style['new'] : "")}
        
        >
            <button onClick={()=>{setReveal(!reveal)}} className={style['notification-badge'] + " animate:wiggle" }>
                <IoNotifications className={/* style['new'] +  */" icon"}></IoNotifications>
                <span className={style["dot"]}></span>
            </button>
            <NotificationSideBoard
                notificationBadgeClassName={style['notification-badge']}
                reveal = {reveal}
                setReveal = {setReveal}
                unreadNotifications={unreadNotifications}
                notifications={notifications}
            />
        </div>
    )
}