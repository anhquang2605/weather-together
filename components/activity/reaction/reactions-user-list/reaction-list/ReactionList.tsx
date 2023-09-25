import React from 'react';
import style from './reaction-list.module.css';
import { ReactionWithUser } from '../../../../../types/Reaction';
import { RiPassPendingLine } from 'react-icons/ri';
import {LiaUserFriendsSolid} from 'react-icons/lia';
import MiniAvatar from '../../../../user/mini-avatar/MiniAvatar';
interface ReactionItemProps{
    reaction: ReactionWithUser;
}
interface ReactionListProps {
    results: ReactionWithUser[];
    fetching: boolean;
    setEndOfList: (endOfList: boolean) => void;
}
const FriendStatus: React.FC<{status: string}> = ({status}) => {
    switch(status){
        case 'accepted':
            return  <div className={`${style['friend-status']}`}>
                        <LiaUserFriendsSolid className={`${style['status-icon']} icon mr-2 border border-indigo-700 rounded-full`}/> 
                        <span className={`${style['status-title']}`}>Buddy</span>
                    </div>
        case 'pending':
            return  <div className={`${style['friend-status']}`}>
                        <RiPassPendingLine className={`${style['status-icon']} icon mr-2`}/>
                        <span className={`${style['status-title']}`}>Pending...</span>
                    </div>
        default:
            return <button className={`action-btn `}>Add Buddy</button>
    }
};
const ReactionItem: React.FC<ReactionItemProps> = (props:ReactionItemProps) => {
    const {reaction} = props;
    return (
        <div className={style['reaction-item']}>
            <MiniAvatar 
                username={reaction.username}
                profilePicturePath={reaction.profilePicture}
                size="large"
            />
            <div className={style['reaction-item__content']}>
                <div className={style['reaction-item__content__username']}>
                    {reaction.username}
                </div>
                <div className={style['reaction-item__content__reaction']}>
                    {reaction.name}
                </div>
            </div>
           <FriendStatus status={reaction.status}/>
        </div>
    );
}
const ReactionList: React.FC<ReactionListProps> = (props:ReactionListProps) => {
    const {results, fetching, setEndOfList} = props;
    return (
        <div className={style['reaction-list']}>
            {
                results.map((item)=>{
                    return(
                        <ReactionItem key={item.username} reaction={item}/>
                    )
                })
            }
        </div>
    );
};

export default ReactionList;