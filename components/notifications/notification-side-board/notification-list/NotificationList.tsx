import style from './notification-list.module.css'
import { Notification } from './../../../../types/Notifications'

interface NotificationListProps {
    notifications: Notification[];
}
export default function NotificationList({ notifications }: NotificationListProps) {
    const notificationsListJSX = notifications.map((notification) => {
        return(
            <div className={style['notification-list-item']}>
                
                <span className={style['notification-list-item__title']}></span>
            </div>
        )
    })
    return(
        <div className={style['notification-list']}>
        </div>
    )
}