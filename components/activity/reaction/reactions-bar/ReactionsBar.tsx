import React, {useEffect} from 'react';
import { Reaction } from '../../../../types/Reaction';
import style from './reactions-bar.module.css';
import ReactionComponent from '../ReactionComponent';
interface ReactionButtonProps{
    reactionsGroups: {
        _id: string;
        count: number;
    }[];
}
export default function ReactionsBar( {reactionsGroups}: ReactionButtonProps){

    return (
        <div className={style['reactions-bar']}>
            {reactionsGroups.map((reactionGroup) => {
                return(
                    <ReactionComponent key={reactionGroup._id} name={reactionGroup._id} count={reactionGroup.count} />
                )
            })}
        </div>
    )
}