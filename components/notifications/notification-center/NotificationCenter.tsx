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
    [key: string]: string | undefined | number | Notification[];
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
const ORIGINAL_LIMIT= 5;
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
    const [fetching, setFetching] = useState<{[key:string]: boolean}>({
        all: false,
        unread: false,
    });
    const [reveal, setReveal] = useState(false);
    const [unreadModeSet, setUnreadModeSet] = useState(false);
    const [filterUnRead, setFilterUnRead] = useState<boolean>(false);
    const [mode, setMode] = useState('all');
    const [modes, setModes] = useState<NotificationModes>(GenerateInitialNotificationModes())
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
    const [loadMoreStatus, setLoadMoreStatus] = useState<'loading' | 'idle' | 'error'>('idle');
    const {data:session} = useSession();
    const user = session?.user;
    const PORT = process.env.NEXT_PUBLIC_WS_SERVER_PORT;
    const SERVER_HOST = process.env.NEXT_PUBLIC_WS_SERVER_HOST;
    const socket = useRef<WebSocket | null>(null);

    const updateProperty = (propertyName:string, newValue: any, modeName?:string) => {
        setModes(prevState => ({
          ...prevState,
          [modeName ?? mode]: { ...prevState[modeName ?? mode], [propertyName]: newValue },
        }));
      };
    const addToProperty = (propertyName:string, newValue: any, modeName?:string) => {
        setModes(prevState => ({
            ...prevState,
            [modeName ?? mode]: { 
                ...prevState[modeName ?? mode], 
                [propertyName]: prevState[modeName ?? mode][propertyName] += newValue 
        },
        }))
    }
    const prependNotification = (notification: Notification) => {
        setModes(prevState => ({
            ...prevState,
            [mode]: { ...prevState[mode], notifications: [notification, ...prevState[mode].notifications] },
        }));
    }
    const handlePrependNotification = (notification: Notification) => {//to set state when a new notification is added in the db
        prependNotification(notification);
        setUnreadNotificationsCount(prevState => prevState + 1);
        addToProperty('currentTotalNumberOfNotifications', 1);
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
            setLoadingNotification(
                (prevState) => {
                    const newSet = new Set(prevState);
                    newSet.delete(index);
                    return newSet;
                }
            )
            //gotta remove both side
            const removed = newNotifications.splice(index, 1);
            //update self total number of notifications
            addToProperty('currentTotalNumberOfNotifications', -1);
            if(removed[0].read === false){
                setUnreadNotificationsCount(prevState => prevState - 1);
                if(mode === 'all'){
                    const unreadNotifications = [...modes['unread'].notifications];
                    const newUnreadNotifications = unreadNotifications.filter((notification) => notification._id !== removed[0]._id);
                    updateProperty('notifications', newUnreadNotifications, 'unread');
                    addToProperty('currentTotalNumberOfNotifications', -1, 'unread');
                }
            }
            if(mode === 'unread'){
                const allNotifications = [...modes['all'].notifications];
                const newAllNotifications = allNotifications.filter((notification) => notification._id !== removed[0]._id);
                updateProperty('notifications', newAllNotifications, 'all');
                addToProperty('currentTotalNumberOfNotifications', -1, 'all');
            }

           

        } else {//set read to a notification           
            let notification_id = newNotifications[index]._id;
            if(mode === 'unread'){
                newNotifications.splice(index, 1);
                const allNotifications = [...modes['all'].notifications];
                for (const notification of allNotifications) {
                    if(notification._id === notification_id){
                        notification.read = true;
                    }
                }
                updateProperty('notifications', allNotifications, 'all');
            } else {
                newNotifications[index].read = true;
            }
            setUnreadNotificationsCount(prevState => prevState - 1);
            
        }
        updateProperty('notifications', newNotifications);
    }
    const handleSetRead = (notification_id: string, index: number) => {
        setLoadingNotification(prevState => new Set([...prevState, index]));
        fetch(`/api/notification/put-notification-read`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: notification_id?.toString(),
            })
        }).then(res => {
            if(res.ok){
                handleUpdateNotificationStates(index, false);
                setLoadingNotification(prevState => 
                    {
                        const set = new Set([...prevState])
                        set.delete(index);
                        return set;
                    }
                );
            }
        })
    }
    const handleSetAllRead = () => {
        fetch(`/api/notification/put-all-notifications-read`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user?.username?.toString(),
            })
        }).then(res => {
            if(res.status === 200){
                setUnreadNotificationsCount(0);
                if(mode === 'unread'){
                    updateProperty('notifications', []);
                    const allNotifications = [...modes['all'].notifications];
                    allNotifications.forEach((notification) => {
                        notification.read = true;
                    })
                    updateProperty('notifications', allNotifications, 'all');
                }else{
                    const newNotifications = [...modes[mode].notifications];
                    newNotifications.forEach((notification) => {
                        notification.read = true;
                    })
                    updateProperty('notifications', newNotifications);
                }

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
        }).then(res => {
            if(res.ok){
                handleUpdateNotificationStates(index, true);
            }
        })
    }
    const handleFetchMoreNotifications = (limit:number) => {
        setLoadMoreStatus('loading');
        const lastCursor = modes[mode].notifications[modes[mode].notifications.length - 1].createdDate;
        fetch(`/api/notification/get-notifications?username=${user?.username}&limit=${limit}&cursor=${lastCursor}&unread${filterUnRead}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(data => {
            setLoadMoreStatus('idle');
            handleAddNotificationsFromServer(data);

        })
    }
    const handleFetchIntialNotifications = (limit:number) => {
        setFetching((prevState) => {
            return {
                ...prevState,
                [mode]: true,
            }

        });
        fetch(`/api/notification/get-initial-notifications?username=${user?.username}&limit=${limit}?&unread=${filterUnRead}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(data => {
            if(data.result && data.result.length > 0){
                handleAddNotificationsFromServer(data); 
                setFetching(
                    (prevState) => {
                        return {
                            ...prevState,
                            [mode]: false,
                        }
                    }
                )
            }
        })
    }
    const loadMore = () => {
        handleFetchMoreNotifications(modes[mode].limit);
    }
    useEffect(() => {
        handleFetchIntialNotifications(modes[mode].limit);
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
            handleFetchIntialNotifications(modes[mode].limit);
        }
    },[mode])
    //need to update total number of notifications when user delete a notification or new notification is added

    return(
        <NotificationContext.Provider value={{loadingNotification: loadingNotification, limit: ORIGINAL_LIMIT, fetching:fetching[mode], unreads: unreadNotificationsCount}}>
            <div
                className={style['notification-center'] + " mt-4 mr-8  " + (reveal ? style['reveal'] : "") + (unreadNotificationsCount > 0 ? " " + style['new'] : "")}
            
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
                    setAllRead={handleSetAllRead}
                    unreadsTotal={unreadNotificationsCount}
                />
            </div>
        </NotificationContext.Provider>
    )
}