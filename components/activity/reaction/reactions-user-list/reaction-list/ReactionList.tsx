import React, { useEffect, useState } from 'react';
import style from './reaction-list.module.css';
import { ReactionWithUser } from '../../../../../types/Reaction';
import { RiPassPendingLine } from 'react-icons/ri';
import {LiaUserFriendsSolid} from 'react-icons/lia';
import MiniAvatar from '../../../../user/mini-avatar/MiniAvatar';
import { REACTION_ICON_MAP } from '../../reaction-icon-map';
import { useSession } from 'next-auth/react';
import LoadingIcon from '../../../../plugins/loading-icon/LoadingIcon';
import { set } from 'lodash';
import Link from 'next/link'
interface ReactionItemProps{
    reaction: ReactionWithUser;
}
interface ReactionListProps {
    results: ReactionWithUser[];
    fetchingStatus: string ;
    isLoaded: boolean;
    setEndOfList: (endOfList: boolean) => void;
}
interface FriendStatusProps {
    status: string;
    setItem: React.Dispatch<React.SetStateAction<ReactionWithUser>>;
    myUsername: string;
    username: string;
}
const FriendStatus = (props:FriendStatusProps) => {
    const {status, setItem, myUsername, username} = props;
    const handleAddBuddy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const oldStatus = status;
        const sender = myUsername;
        const receiver = username;
        setItem(
            prevState => {
                return {...prevState, status: 'pending'}
            }
        )
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sender, receiver})
        }
        try {
            await fetch('/api/friend-requests', options);
         
        } catch (error) {
            setItem(
                prevState => {
                    return {...prevState, status: oldStatus}
                }
            )
        }
    }
    switch(status){
        case 'accepted':
            return  <div className={`${style['status-badge']}`}>
                        <LiaUserFriendsSolid className={`${style['status-icon']} icon mr-2 border border-indigo-700 rounded-full`}/> 
                        <span className={`${style['status-title']}`}>Buddy</span>
                    </div>
        case 'pending':
            return  <div className={`${style['status-badge']}`}>
                        <RiPassPendingLine className={`${style['status-icon']} icon mr-2`}/>
                        <span className={`${style['status-title']}`}>Pending...</span>
                    </div>
        default:
            return <button onClick={(e)=>{
                handleAddBuddy(e);
            }} title="" className={`action-btn `}>Add Buddy</button>
    }
};
const ReactionItem: React.FC<ReactionItemProps> = (props:ReactionItemProps) => {
    const {data: session} = useSession();
    const myUsername = session?.user?.username;
    const {reaction} = props;
    const [reactionItem, setReactionItem] = useState<ReactionWithUser>(reaction);
    return (
        <Link href={`/userprofile/${reactionItem.username}`} title="View Profile" className={style['reaction-item']}>
            <div className={style['reaction-item__content__reaction']}>
                    {REACTION_ICON_MAP[reactionItem.name]}
            </div>
            <MiniAvatar 
                username={reactionItem.username}
                profilePicturePath={reactionItem.profilePicture}
                size="large"
            />
            <div className={style['reaction-item__content']}>
                <div className={style['reaction-item__content__username']}>
                    {reactionItem.name !== " " ? reactionItem.fullName : reactionItem.username}
                </div>
            </div>
            {
                myUsername !== reactionItem.username && 
                <span className={style['friend-status']}>
                    <FriendStatus username={reactionItem.username} myUsername={myUsername || ""} setItem = {setReactionItem} status={reactionItem.status}/>
                </span>

            }

            
        </Link>
    );
}

const ReactionList: React.FC<ReactionListProps> = (props:ReactionListProps) => {
    const {results, fetchingStatus, setEndOfList,isLoaded} = props;
    const observerHandler = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting){
                setEndOfList(true);
            }
        })
    }
    useEffect(()=>{

        if(isLoaded){
            const options = {
                root: document.querySelector(`.${style['reaction-list']}`),
            }
            const observer = new IntersectionObserver(observerHandler, options);
            const target = document.querySelector(`.${style['lazy-target']}`);
            if(target){
                observer.observe(target);
            }
            return () => {
                observer.disconnect();
            }
        }
    },[isLoaded])
    return (
        <div className={style['reaction-list']}>
            {
                results.map((item)=>{
                    return(
                        <ReactionItem key={item.username} reaction={item}/>
                    )
                })
            }
            {<div className={style['lazy-target'] + " " + (style[fetchingStatus])}>
                {
                    fetchingStatus === 'loading' && <LoadingIcon/>
                }
                {
                    fetchingStatus === 'failed' && <div className={style['error']}>Error loading more reactions</div>
                }
            </div>}
           
        </div>
    );
};

export default ReactionList;