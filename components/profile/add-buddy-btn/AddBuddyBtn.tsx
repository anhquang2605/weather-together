import React from 'react';
import style from './add-buddy-btn.module.css';
import { LiaUserFriendsSolid } from 'react-icons/lia';
import { RiPassPendingLine } from 'react-icons/ri';

interface AddBuddyBtnProps {
    handleAddBuddy: (e:React.MouseEvent) => void;
    status: string
}

const AddBuddyBtn: React.FC<AddBuddyBtnProps> = (props) => {
    const {handleAddBuddy, status} = props;
  const buddyStatusRenderer = (status:string) => {
    switch(status){
        case 'accepted':
            return  <>
                        <LiaUserFriendsSolid className={`${style['friend-icon']} icon mr-2 border border-indigo-700 rounded-full`}/> 
                        <span className={`${style['friend-title']}`}>Buddy</span>
                    </>
        case 'pending':
            return  <>
                        <RiPassPendingLine className={`${style['friend-icon']} icon mr-2`}/>
                        <span className={`${style['friend-title']}`}>Friend request pending...</span>
                    </>
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