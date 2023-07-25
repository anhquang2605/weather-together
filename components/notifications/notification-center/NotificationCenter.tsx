import {useState, useEffect, use} from 'react'
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
    const setNotificationsFromServer = (notifications: Notification[]) => {
        const unreads= getNotificationsUnread(notifications);
        setNotifications(notifications);
        setUnreadNotifications(unreads);
    }
    useEffect(() => {
        fetch(`/api/notification/get-notifications?username=${user?.username}`, {
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
            if(payload.type === 'new-notification'){
                setNotifications((prev) => [...prev, payload.data]);
                setUnreadNotifications((prev) => [...prev, payload.data]);            
            }
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
            <button className={style['notification-badge'] + " animate:wiggle" }>
                <IoNotifications className={/* style['new'] +  */" icon"}></IoNotifications>
                <span className={style["dot"]}></span>
            </button>
            <NotificationSideBoard
                unreadNotifications={unreadNotifications}
                notifications={notifications}
            />
        </div>
    )
}