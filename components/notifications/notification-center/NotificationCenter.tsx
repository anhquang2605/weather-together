import {useState, useEffect, use, useRef} from 'react'
import style from './notification-center.module.css'
import {IoNotifications} from 'react-icons/io5'
import { Notification } from '../../../types/Notifications';
import NotificationSideBoard from '../notification-side-board/NotificationSideBoard';
import { useSession } from 'next-auth/react';
import { getNotificationsUnread } from '../../../libs/notifications';
import { set } from 'mongoose';
import { add } from 'date-fns';
import { NextApiResponse } from 'next';
import { NotificationContext } from '../NotificationContext';
export function getServerSideProps() {
    
    return {
      props: {}, // will be passed to the page component as props
    }
}
interface NotificationMode{
    mode: string;
    currentTotalNumberOfNotifications: number;
    notifications: Notification[];
    pageNo: number;
    limit: number;
}
interface NotificationModes{
    [key:string]:NotificationMode
}
interface NotificationsReponse extends NextApiResponse{
    result: Notification[];
    unreads: number;
    total?: number;

}
const modesList = ['all', 'unread'];
const ORIGINAL_LIMIT= 2;
function GenerateInitialNotificationModes() {
    return modesList.reduce((acc:NotificationModes,item) => {
        acc[item] = {
            mode: item,
            currentTotalNumberOfNotifications: 0,
            notifications: [],
            pageNo: 0,
            limit: ORIGINAL_LIMIT,
        }
        return acc;        
    },{})
}
export default function NotificationCenter(){
    const [loadingNotification, setLoadingNotification] = useState(new Set<number>());
    const [reveal, setReveal] = useState(false);
    const [unreadModeSet, setUnreadModeSet] = useState(false);
    const [filterUnRead, setFilterUnRead] = useState<boolean>(false);//[10, 20, 50, 100
    const [mode, setMode] = useState('all');
    const [modes, setModes] = useState<NotificationModes>(GenerateInitialNotificationModes())
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
    const [loadMoreStatus, setLoadMoreStatus] = useState<'loading' | 'idle' | 'error'>('idle');//[10, 20, 50, 100
    const {data:session} = useSession();
    const user = session?.user;
    const PORT = process.env.NEXT_PUBLIC_WS_SERVER_PORT;
    const SERVER_HOST = process.env.NEXT_PUBLIC_WS_SERVER_HOST;
    const socket = useRef<WebSocket | null>(null);
    const handleItemLoadingSpin = (index:number) => {
        const notificationItem = document.getElementById('notification-item-container')?.children[index];
        if(notificationItem){
            
        }
    }
    const updateProperty = (propertyName:string, newValue: any, modeName?:string) => {
        setModes(prevState => ({
          ...prevState,
          [modeName ?? mode]: { ...prevState[modeName ?? mode], [propertyName]: newValue },
        }));
      };
    const handlePrependNotification = (notification: Notification) => {//to set state when a new notification is added in the db
        const newNotifications = [notification, ...modes[mode].notifications];
        updateProperty('notifications', newNotifications);
        setUnreadNotificationsCount(prevState => prevState + 1);
    };
    const handleAddNotifications = (notifications: Notification[]) => {//to set state when fetching notifications from the server, used when user fetch more notifications or delete a notification
        setModes(prevState => ({
            ...prevState,
            [mode]: { ...prevState[mode], 
                notifications: [...prevState[mode].notifications, ...notifications], 
            },
          }));
    }
    const handleAddNotificationsFromServer = (response:NotificationsReponse) => {
        const newNotifications = response.result;
        const newUnreadNotificationsCount = response.unreads;
        if(response.total){
            updateProperty('currentTotalNumberOfNotifications', response.total);
        }
        setUnreadNotificationsCount(newUnreadNotificationsCount);
        handleAddNotifications(newNotifications);
    }
    const handleUpdateNotificationStates = (index: number, del: boolean) => {
        const newNotifications = [...modes[mode].notifications];
        if(del){
            //gotta remove both side
            const removed = newNotifications.splice(index, 1);
            if(mode === 'unread'){
                const allNotifications = [...modes['all'].notifications];
                const newlist = allNotifications.filter((notification) => notification._id !== removed[0]._id);
                updateProperty('notifications', newlist, 'all');
            } else {
                const unreadNotifications = [...modes['unread'].notifications];
                const newlist = unreadNotifications.filter((notification) => notification._id !== removed[0]._id);
                updateProperty('notifications', newlist, 'unread');
            }

            setLoadingNotification(
                (prevState) => {
                    const newSet = new Set(prevState);
                    newSet.delete(0);
                    return newSet;
                }
            )
            if(!removed[0].read){
                setUnreadNotificationsCount(prevState => prevState - 1);
            }
        } else {//set read to a notification           
            newNotifications[index].read = true;
        }
        updateProperty('notifications', newNotifications);
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
                const newNotifications = [...modes[mode].notifications];
                newNotifications.forEach((notification) => {
                    notification.read = true;
                })
                updateProperty('notifications', newNotifications);
            }
        })
    }
    const handleDeleteOneNotification = (notification_id: string, index: number) => {
        setLoadingNotification(prevState => new Set([...prevState, index]));
        const params = new URLSearchParams({
            id: notification_id?.toString(),
            curPageNo: modes[mode].pageNo.toString(),
            limit: modes[mode].limit.toString(),
            username: user?.username as string,
        })
        fetch(`/api/notification/delete-notification?${params.toString()}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(data => {
            if(data.newNotification){
                const newNotification =data.notification;
                
                handleAddNotifications(newNotification)
                
            }
            handleUpdateNotificationStates(index, true);
        })
    }
    const handleFetchMoreNotifications = (limit:number, curPageNo: number) => {
        setLoadMoreStatus('loading');
        fetch(`/api/notification/get-notifications?username=${user?.username}&limit=${limit}&pageNo=${curPageNo}&unread${filterUnRead}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(data => {
            setLoadMoreStatus('idle');
            handleAddNotificationsFromServer(data);
            updateProperty('pageNo', curPageNo + 1);
            updateProperty('limit', ORIGINAL_LIMIT);
        })
    }
    const handleFetchIntialNotifications = (limit:number, curPageNo: number) => {
        fetch(`/api/notification/get-initial-notifications?username=${user?.username}&limit=${limit}&pageNo=${curPageNo}&unread=${filterUnRead}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(data => {
            if(data.result && data.result.length > 0){
                handleAddNotificationsFromServer(data); 
                updateProperty('pageNo', curPageNo + 1);
            }
        })
    }
    const loadMore = () => {
        handleFetchMoreNotifications(modes[mode].limit, modes[mode].pageNo);
    }
    useEffect(() => {
        handleFetchIntialNotifications(modes[mode].limit, modes[mode].pageNo);
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
                handlePrependNotification(payload.data);
            } 
        socket.current = ws ;

        }
        return () => {
            ws.close();
        }
    },[])
   
    useEffect(()=>{
        if(filterUnRead) setMode('unread');
        else setMode('all');
    },
    [filterUnRead])
    useEffect(()=>{
        if(mode === 'unread' && !unreadModeSet){
            setUnreadModeSet(true);
            handleFetchIntialNotifications(modes[mode].limit,modes[mode].pageNo);
        }
    },[mode])
    //need to update total number of notifications when user delete a notification or new notification is added
    useEffect(()=>{//handling pages and number to fetch when user fetch more notifications or delete a notification from the state
        let newPageNo;
        let curMode = modes[mode];
        let expectedFetchNumber = curMode.pageNo * curMode.limit;
        const notifications = curMode.notifications;
        const notificationsLength = notifications.length;
        if(notificationsLength < expectedFetchNumber){
            newPageNo = Math.floor(notifications.length / curMode.limit);
            updateProperty('pageNo', newPageNo);
        }else if(notificationsLength > expectedFetchNumber){
            updateProperty('limit', notifications.length);
            updateProperty('pageNo', 0);
        }


    }, [modes[mode].notifications.length])

    return(
        <NotificationContext.Provider value={{loadingNotification: loadingNotification}}>
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
                    notifications={modes[mode].notifications}
                    loadMore={loadMore}
                    canLoadMore={modes[mode].currentTotalNumberOfNotifications > modes[mode].notifications.length}
                    loadMoreStatus={loadMoreStatus}
                    filterUnRead={filterUnRead}
                    setFilterUnRead={setFilterUnRead}
                    allTotals={modes['all'].notifications.length}
                    handleSetRead={handleSetRead}
                    handleDeleteOneNotification={handleDeleteOneNotification}
                />
            </div>
        </NotificationContext.Provider>
    )
}