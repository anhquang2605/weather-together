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
/*
    This component is used to display the reaction button
    To manage the reaction state, this component will fetch the initial reaction from the server
    and then update the state accordingly
    If the user has reacted, the button will be highlighted, there would be reaction returned by the server but only when the reaciton name is not empty

    Note for next steps:
    - only set expireAt field when the user revoke the reaction by setting the name to ''
    - when the user react, the expireAt will be remove by using the unset operator in mongodb
    - we keep the reaction alive for 1 day if ther user has not react again
    - on client side:
        + We debounce the reaction update to 1 second to prevent user from spamming the reaction button while User can still interact with the internal state of the button for better UX
        + We use optimistic UI to update the reaction state, this means that we update the reaction state before the server response, if the server response is not successful, we revert the reaction state back to the previous state   

*/
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