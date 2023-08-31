import React from 'react';
import style from './request-card.module.css';
import { UserInFriendRequests } from '../../../../../types/User';
import MiniAvatar from '../../../../activity/mini-avatar/MiniAvatar';
import { RAINBOW_COLORS } from '../../../../../constants/rainbow-colors';
import {IoLocation} from 'react-icons/io5'
import Image from 'next/image';
import { useRouter } from 'next/router';
import {IoCheckmarkCircle,IoEllipsisHorizontalCircleSharp } from 'react-icons/io5'
import { useSession } from 'next-auth/react';
interface RequestCardProps {
    user: UserInFriendRequests;
    index: number;
    curMode: number;
    updater: (index: number, fields: Partial<UserInFriendRequests>) => void;
}
interface StatusToIconMap{
    [key: string]: JSX.Element;
}
const RequestCard: React.FC<RequestCardProps> = ({user, curMode, index, updater}) => {
    const color = RAINBOW_COLORS[Math.floor(Math.random() * RAINBOW_COLORS.length)];
    const router = useRouter();
    const {data: session} = useSession();
    const account_user = session?.user;
    const account_username  = account_user?.username || "";
    const handleGoToProfile = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/profile/${user.username}`);
    }
    const statusToIcon: StatusToIconMap = {
        "accepted": <IoCheckmarkCircle className="icon mr-1"/>,
        "pending": <IoEllipsisHorizontalCircleSharp className="icon mr-1"/>,
    }
    const handleAccept = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("here");
        const oldStatus = user.status;
        const updatedFields:Partial<UserInFriendRequests> = {
            status: "accepted",
            updatedDate: new Date()
        }
        const sender = curMode ? account_username : user.username;
        const receiver = curMode ? user.username : account_username;  
        updater(index, updatedFields);
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: "accepted",
                sender,
                receiver,
            })
        }
        const path = '/api/friend-requests';
        const response = await fetch(path, options);
        if(!response || response.status !== 200){
            updater(index, {status: oldStatus});
        }   
    }
    return (
        <div onClick={(event) => handleGoToProfile} className={style['request-card']}>
            <div className={style['background-image']}>
                {
                    user.backgroundPicture === "" ?
                    <div style={{backgroundColor: color}} className='w-full h-full'>

                    </div>
                    :
                    <Image width={400} height={200} src={user.backgroundPicture} alt="background picture" />
                }

            </div>
            <div className={style['lower-half']}>
                <MiniAvatar 
                    username={user.username}
                    profilePicturePath={user.profilePicture}
                    size= "large"
                    className={`shadow-md -mt-16 border-slate-200 ${style['avatar']}`}
                />
                <div className={style['information']}>
                    <div className={style['name']}>
                        {
                            (user.name !== "")?
                            `${user.name}`:
                            user.username
                        }
                    </div>
                    <div className={style['location']}>
                        <IoLocation className="w-5 h-5 mr-1"/> {user.city}
                    </div>
                    {   
                        user.status === "accepted" || curMode === 1 ?
                            <div className={`${style['status']} ${style[user.status]}`}>
                                {statusToIcon[user.status]} {user.status}
                            </div>
                        :
                            <button onClick={event => handleAccept(event)} className={`${style['accept-btn']} action-btn ${style['status']}`}>
                                Accept
                            </button>
                    }
                </div>
            </div>

            
        </div>
    );
};

export default RequestCard;