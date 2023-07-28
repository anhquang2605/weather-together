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
function GenerateInitialNotificationModes() {
    return modesList.reduce((acc:NotificationModes,item) => {
        acc[item] = {
            mode: item,
            currentTotalNumberOfNotifications: 0,
            notifications: [],
            pageNo: 0,
        }
        return acc;        
    },{})
}
export default function NotificationCenter(){
    const [limit, setLimit] = useState<number>(2);//[10, 20, 50, 100
    const [pageNo, setPageNo] = useState<number>(0);//[10, 20, 50, 100
    const [reveal, setReveal] = useState(false);
    const [filterUnRead, setFilterUnRead] = useState<boolean>(false);//[10, 20, 50, 100
    const [mode, setMode] = useState('all');
    const [modes, setModes] = useState<NotificationModes>(GenerateInitialNotificationModes())
    const [action, setAction] = useState<string>('');
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
    const [loadMoreStatus, setLoadMoreStatus] = useState<'loading' | 'idle' | 'error'>('idle');//[10, 20, 50, 100
    const {data:session} = useSession();
    const user = session?.user;
    const PORT = process.env.NEXT_PUBLIC_WS_SERVER_PORT;
    const SERVER_HOST = process.env.NEXT_PUBLIC_WS_SERVER_HOST;
    const socket = useRef<WebSocket | null>(null);

    const updateProperty = (modeKey:string, propertyName:string, newValue: any) => {
        setModes(prevState => ({
          ...prevState,
          [modeKey]: { ...prevState[modeKey], [propertyName]: newValue },
        }));
      };
    const handleAddNotifications = (notifications: Notification[]) => {
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
        const newTotal = response.total;
        if(newTotal){
            updateProperty(mode, 'currentTotalNumberOfNotifications', newTotal);
        }
        setUnreadNotificationsCount(newUnreadNotificationsCount);
        handleAddNotifications(newNotifications);
    }
    const handleUpdateNotificationStates = (index: number, del: boolean) => {
        const newNotifications = [...modes[mode].notifications];
        if(del){
            newNotifications.splice(index, 1);
        } else {//set read to a notification           
            newNotifications[index].read = true;
        }
        updateProperty(mode, 'notifications', newNotifications);
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
                updateProperty(mode, 'notifications', newNotifications);
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
                setAction('delete');
            }
        })
    }
    const handleFetchMoreNotifications = (limit:number, curPageNo: number) => {
        setLoadMoreStatus('loading');
        fetch(`/api/notification/get-notifications?username=${user?.username}&limit=${limit}&page=${curPageNo}&unread${filterUnRead}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(data => {
            setLoadMoreStatus('idle');
            handleAddNotificationsFromServer(data);
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
                setUnreadNotificationsCount(data.unreads)
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
                handleAddNotifications(payload.data);
                setAction('add');
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
   
    useEffect(()=>{
        if(filterUnRead) setMode('unread');
        else setMode('all');
    },
    [filterUnRead])
    useEffect(()=>{//to update the total number of notifications when ever a new notification is added or the user deletes a notification
        if(action === 'delete'){
            updateProperty(mode, 'currentTotalNumberOfNotifications', modes[mode].currentTotalNumberOfNotifications - 1);
        }else if(action === 'add'){
            updateProperty(mode, 'currentTotalNumberOfNotifications', modes[mode].currentTotalNumberOfNotifications + 1);
        }
    },[action])
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
                notifications={modes[mode].notifications}
                loadMore={loadMore}
                canLoadMore={modes[mode].currentTotalNumberOfNotifications > modes[mode].notifications.length}
                loadMoreStatus={loadMoreStatus}
                filterUnRead={filterUnRead}
                setFilterUnRead={setFilterUnRead}
            />
        </div>
    )
}