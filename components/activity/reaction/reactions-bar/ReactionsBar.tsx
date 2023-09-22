import React, {useEffect, useState} from 'react';
import { Reaction } from '../../../../types/Reaction';
import style from './reactions-bar.module.css';
import ReactionComponent from '../ReactionComponent';
import { set } from 'lodash';
interface ReactionButtonProps{
    reactionsGroups: {
        name: string;
        count: number;
    }[];
}
export default function ReactionsBar( {reactionsGroups}: ReactionButtonProps){
    const totalCount = reactionsGroups.reduce((acc, curr) => {
        return acc + curr.count;
    }, 0);
    return (
        <div className={style['reactions-bar']}>
            {
                totalCount > 0 &&
                <>
                    <div className={style['reactions-bar__title']}>
                        Reactions
                    </div>
                    <div className={style["target-reactions-group-names"]}>
                        {reactionsGroups.map((reactionGroup) => {
                            return(
                                <ReactionComponent key={reactionGroup.name} name={reactionGroup.name}/>
                            )
                        })}
                    </div>
                </>
            }
             <div className={style['reactions-bar__total-count']}>
                        {totalCount > 0 ? totalCount + ' reacted' : 'No Reactions'}
                    </div>

        </div>
    )
}