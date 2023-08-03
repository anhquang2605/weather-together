import {useState} from 'react';
import style from './reaction-button.module.css';
import { REACTION_ICON_MAP } from '../reaction-icon-map';
import { REACTION_TYPE_NAMES_LIST } from '../reactions-type-names-list';
import _, { set } from 'lodash';
import { fetchFromGetAPI, insertToPostAPI, updateToPutAPI } from '../../../../libs/api-interactions';
import { Reaction } from '../../../../types/Reaction';
import ReactionComponent from '../ReactionComponent';
export interface ReactionButtonProps{
    username: string;
    targetId: string;
}
interface ReactionFetchParams{
    username: string;
    targetId: string;
}
interface UpdatedFields{
    name: string,
    updatedDate: Date,
    expireAt?: Date,
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
const REACTION_EXPIRE_TIME = 1000 * 60 * 15;//15 minutes in miliseconds used to set the expireAt field in the reaction document, to create a date from now, use new Date(Date.now() + REACTION_EXPIRE_TIME)
export default function ReactionButton(
    {
        username,
        targetId
    }: ReactionButtonProps
){
    const [reacted, setReacted] = useState(false);
    const [reaction, setReaction] = useState<Reaction>();
    const [revealed, setRevealed] = useState(false);
        //reaction.name == '' means no reaction, this happen when the user reacted and then unreacted
    const handleAddReaction = async (reactionName: string, username: string, targetId: string) => {
            const path = `reactions/post-reaction`;
            const reaction = {
                username,
                targetId,
                name : reactionName,
                createdDate: new Date(),
                updatedDate: new Date(),

            }
            const response = await insertToPostAPI(path, reaction);
            if(response.status == 200){
                setReacted(true);
                setReaction(reaction);
            }
    }
    const handleUpdateReaction = async (reactionName: string, username: string, targetId: string) => {
        //use put request to fetch the reaction
        const oldReaction = {...reaction!};//guarantee to be not null, since this function is called when the reaction is set
        setReaction( prevState => {
            if(prevState)
            return {
                ...prevState,
                name: reactionName,
                updatedDate: new Date()
            }
        });

        const path = `reactions/put-reaction`;
        const updatedFields:UpdatedFields = {
            name: reactionName,
            updatedDate: new Date()
        }
        if(reactionName == ''){
            updatedFields['expireAt'] = new Date(Date.now() + REACTION_EXPIRE_TIME);
        }
        const bodyDate = {
            username,
            targetId,
            updatedFields
        }
        const response = await  updateToPutAPI(path, bodyDate);
        if(response.status !== 200){
            setReaction(oldReaction);
        } 

    }
    const handleFetchInitialReaction = async (path: string, params: ReactionFetchParams) => {
        const reponse = await fetchFromGetAPI(path, params);
        const reaction = await reponse.json();
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
            {/* 
                TODO: a button that initially tell user to react if user have not reacted yet, once reacted it will be updated with the reacted reaction
                Once clicked, a list of reaction will be displayed, the user can choose the reaction they want, should be in a form of 
             */}
            <button onClick={()=>setRevealed(pre => !pre)}>
                {reacted && reaction ? REACTION_ICON_MAP[reaction?.name] : 'React'}
            </button>
            {<div className={style['reaction-button__reaction-list'] + " " + (revealed? style['reveal-list'] : "")}>
                {
                    _.map(REACTION_TYPE_NAMES_LIST, (reactionName) => {
                        return (
                            <button key={reactionName} className={style['reaction-icon-btn']}>                  
                                <ReactionComponent name={reactionName} />
                            </button>
                        )
                    })
                }
            </div>}
        </div>
    )
}