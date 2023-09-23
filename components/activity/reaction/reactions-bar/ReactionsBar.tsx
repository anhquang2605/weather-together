import React, {useEffect, useState} from 'react';
import { Reaction } from '../../../../types/Reaction';
import style from './reactions-bar.module.css';
import ReactionComponent from '../ReactionComponent';
import { set } from 'lodash';
interface ReactionButtonProps{
    reactionsGroups: {
        name: string;
        count: number;
        usernames: string[];
    }[];
    usernames: string[];
}
export default function ReactionsBar( {reactionsGroups, usernames}: ReactionButtonProps){
    const totalCount = reactionsGroups.reduce((acc, curr) => {
        return acc + curr.count;
    }, 0);
    const handleFetchUsersFromUsernames = async () => {
        const path = '/api/user/by-usernames';
        const options = {
            method: 'POST',
            body: JSON.stringify(usernames),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = await fetch(path, options);
        if(response.status === 200){
            const data = await response.json();
            
        }
    }
    useEffect(()=>{

    },[])
    return (
        <div className={style['reactions-bar']}>
            {
                totalCount > 0 ?
                <>
                    <div className={style['reactions-bar__title']}>
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