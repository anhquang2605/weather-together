import React, {useEffect, useRef, useState} from 'react';
import { Reaction, ReactionGroup, ReactionWithUser } from '../../../../types/Reaction';
import style from './reactions-bar.module.css';
import ReactionComponent from '../ReactionComponent';
import { last, set } from 'lodash';
import { useSession } from 'next-auth/react';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import ReactionUserList from '../reactions-user-list/ReactionUserList';
import Modal from '../../../modal/Modal';
import { useModalContext } from '../../../modal/ModalContext';

interface ReactionButtonProps{
    reactionsGroups: ReactionGroup[];
    usernames: string[];
    targetId: string;
}
export default function ReactionsBar( {reactionsGroups, usernames, targetId}: ReactionButtonProps){
    const {data: session} = useSession();
    const {setContent, setShowModal} = useModalContext();
    const user = session?.user;
    const myUsername = user?.username || '';
    const totalCount = reactionsGroups.reduce((acc, curr) => {
        return acc + curr.count;
    }, 0);
    
    const handleViewReactionsList = () => {
        setContent(<ReactionUserList reactionGroups={reactionsGroups} username={myUsername} targetId={targetId}/>);
        setShowModal(true);
    }
   
    return (
        <>

            <div className={style['reactions-bar']}>
                {
                    totalCount > 0 ?
                    <>
                        <div onClick={()=>{
                           handleViewReactionsList();
                        }} className={style['reactions-bar__title']}>
                            {totalCount} Reactions
                        </div>
                        <div className={style["target-reactions-group-names"]}>
                            {reactionsGroups.map((reactionGroup) => {
                                return(
                                    <ReactionComponent key={reactionGroup.name} name={reactionGroup.name}/>
                                )
                            })}  
                        </div>
                    </>
                    :
                    <div className={style['reactions-bar__title']}>
                        Be the first to react
                    </div>
                }
                
            </div>
        </>
    )
}
/* 
    1.Fetch all users from usernames, each user will be associated with a reaction
      - create agregation, reactions will be paired with a user
      _ after this, check if user are with the curernt user?
    1. If reacted User are friend, displayed at the top:
        _How to check if user are friend?
        _sorted by reaction time descent
    2. If reacted User are not friend, displayed at the bottom:

*/