import {useState} from 'react';
import style from './reaction-button.module.css';
import { REACTION_ICON_MAP } from '../reaction-icon-map';
import { REACTION_TYPE_NAMES_LIST } from '../reactions-type-names-list';
import _ from 'lodash';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import { Reaction } from '../../../../types/Reaction';
export interface ReactionButtonProps{
    username: string;
    targetId: string;
}
interface ReactionFetchParams{
    username: string;
    targetId: string;
}
export default function ReactionButton(
    {
        username,
        targetId
    }: ReactionButtonProps
){
    const [reacted, setReacted] = useState(false);
    const [reaction, setReaction] = useState<Reaction>();
    const handleInsertReaction = async (reactionName: string, username: string, targetId: string) => {

    }
    const handleFetchInitialReaction = async (path: string, params: ReactionFetchParams) => {
        const reponse = await fetchFromGetAPI(path, params);
        const reaction = await reponse.json();
        //reaction.name == '' means no reaction, this happen when the user reacted and then unreacted
        
        if(reaction){
            setReaction(reaction);
            if(reaction.name != ''){
                setReacted(true);
            }
        } else {
            setReacted(false);
        }
    }   
    return (
        <div className={style['reaction-button']}>
            <button></button>
        </div>
    )
}