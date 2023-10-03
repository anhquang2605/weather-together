import React from 'react';
import style from './user-friend-status.module.css';
import { LiaUserFriendsSolid } from 'react-icons/lia';
import { RiPassPendingLine } from 'react-icons/ri';
import { UserWithFriendStatus } from '../../../types/User';
import { useSession } from 'next-auth/react';
interface UserFriendStatusProps {
    user: UserWithFriendStatus;
    setUser: React.Dispatch<React.SetStateAction<UserWithFriendStatus | null>>;
}

const UserFriendStatus: React.FC<UserFriendStatusProps> = ({user, setUser}) => {
    const {data: session} = useSession();
    const account_user = session?.user;
    const handleAddBuddy = async (e:React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setUser({...user, friendStatus: 'pending'});
        const sender = account_user?.username;
        const receiver = user.username;
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
           setUser({...user, friendStatus: 'stranger'});
        }
        

    }
    const buddyStatusRenderer = (status:string) => {
        switch(status){
            case 'accepted':
                return  <div className={`${style['buddy-badge']}`}>
                            <LiaUserFriendsSolid className={`${style['friend-icon']} icon mr-2 border border-indigo-700 rounded-full`}/> 
                            <span className={`${style['friend-title']}`}>Buddy</span>
                        </div>
            case 'pending':
                return  <div className={`${style['buddy-badge']}`}>
                            <RiPassPendingLine className={`${style['friend-icon']} icon mr-2`}/>
                            <span className={`${style['friend-title']}`}>Pending...</span>
                        </div>
            default:
                return <button title="" onClick={(e) => handleAddBuddy(e)} className={`${style.addFriendButton} action-btn`}>
                            Add buddy
                        </button>
        }
    }
    return (
        <div className={style['user-friend-status']}>
                {
                   buddyStatusRenderer(user.friendStatus)
                }
        </div>
    );
};

export default UserFriendStatus;
