import React from 'react';
import style from './add-buddy-btn.module.css';
import { LiaUserFriendsSolid } from 'react-icons/lia';
import { RiPassPendingLine } from 'react-icons/ri';

interface AddBuddyBtnProps {
    handleAddBuddy: (e:React.MouseEvent) => void;
    status: string;
    gettingBuddyStatus?: boolean
}

const AddBuddyBtn: React.FC<AddBuddyBtnProps> = (props) => {
    const {handleAddBuddy, status} = props;
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
                        <span className={`${style['friend-title']}`}>Friend request pending...</span>
                    </div>
        default:
            return <button title="" onClick={(e) => handleAddBuddy(e)} className={`${style.addFriendButton} action-btn`}>
                        Add buddy
                    </button>
    }
}
    return (
        <div className={style['add-buddy-btn']}>
            {buddyStatusRenderer(status)}
        </div>
    );
};

export default AddBuddyBtn;