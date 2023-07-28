import {useState, useEffect, use, useRef} from 'react'
import style from './notification-center.module.css'
import {IoNotifications} from 'react-icons/io5'
import { Notification } from '../../../types/Notifications';
import NotificationSideBoard from '../notification-side-board/NotificationSideBoard';
import { useSession } from 'next-auth/react';
import { getNotificationsUnread } from '../../../libs/notifications';
import { set } from 'mongoose';
import { add } from 'date-fns';
export function getServerSideProps() {
    
    return {
      props: {}, // will be passed to the page component as props
    }
  }
export default function NotificationCenter(){
    const [limit, setLimit] = useState<number>(2);//[10, 20, 50, 100
    const [pageNo, setPageNo] = useState<number>(0);//[10, 20, 50, 100
    const [reveal, setReveal] = useState(false);
    const [currentNumberOfNotifications, setCurrentNumberOfNotifications] = useState<number>(0);//[10, 20, 50, 100
    const [currentTotalNumberOfNotifications, setCurrentTotalNumberOfNotifications] = useState<number>(0);//[10, 20, 50, 100
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
    const [loadMoreStatus, setLoadMoreStatus] = useState<'loading' | 'idle' | 'error'>('idle');//[10, 20, 50, 100
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
    const addNotificationsFromServer = (notifications: Notification[]) => {
        setCurrentNumberOfNotifications(prev => prev += notifications.length );
        const unreads= getNotificationsUnread(notifications);
        setNotifications((prev) => [...prev, ...notifications]);
        setUnreadNotifications((prev) => [...prev, ...unreads]);
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
                curPageNo: pageNo,
                limit: limit,
                username: user?.username,
            })
        }).then(res => res.json()).then(data => {
            if(data.success){
                const newNotification =data.notification;
                if(newNotification){
                    setCurrentNumberOfNotifications(prev => prev -= 1 );
                    addNotificationsFromServer([newNotification]);
                }else{
                    const notificationsNumberAfterDelete = currentNumberOfNotifications - 1;
                    const itemsOnThisPage = notificationsNumberAfterDelete % limit;
                    if(itemsOnThisPage === 0){
                        setPageNo(prev => prev -= 1);
                    }
                    setCurrentNumberOfNotifications(prev => prev -= 1 );
                }
                handleUpdateNotificationStates(index, true);
 
            }
        })
    }
    const handleFetchMoreNotifications = (limit:number, curPageNo: number) => {
        setLoadMoreStatus('loading');
        fetch(`/api/notification/get-notifications?username=${user?.username}&limit=${limit}&page=${curPageNo}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(data => {
            setLoadMoreStatus('idle');
            addNotificationsFromServer(data);
        })
    }
    const loadMore = () => {
        const newPageNo = pageNo + 1;
        setPageNo(newPageNo);
        handleFetchMoreNotifications(limit, newPageNo);
    }
    useEffect(() => {
        fetch(`/api/notification/get-initial-notifications?username=${user?.username}&limit=${limit}&pageNo=${pageNo}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(data => {
            if(data.result && data.result.length > 0){
                setCurrentNumberOfNotifications(data.result.length);
                setNotificationsFromServer(data.result);
                setCurrentTotalNumberOfNotifications(data.total);
            }   
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
                setCurrentNumberOfNotifications(prev => prev += 1 );
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
    useEffect(()=>{
        const expectedCount = pageNo * limit;
        console.log(currentNumberOfNotifications, currentTotalNumberOfNotifications)
        if(currentNumberOfNotifications > expectedCount && pageNo > 0){
             //add case
            const newPageNo = Math.floor(currentNumberOfNotifications / limit);
            setPageNo(newPageNo);
            const remainItemsOnPage=  limit - (currentNumberOfNotifications % limit);
            setLimit(remainItemsOnPage);
        }
      

    },[currentTotalNumberOfNotifications])
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
                loadMore={loadMore}
                canLoadMore={currentTotalNumberOfNotifications > currentNumberOfNotifications}
                loadMoreStatus={loadMoreStatus}
            />
        </div>
    )
}