import {useEffect, useState} from 'react';
import style from './reaction-button.module.css';
import { REACTION_ICON_MAP } from '../reaction-icon-map';
import { REACTION_TYPE_NAMES_LIST } from '../reactions-type-names-list';
import _ from 'lodash';
import { fetchFromGetAPI, insertToPostAPI, updateToPutAPI } from '../../../../libs/api-interactions';
import { Reaction } from '../../../../types/Reaction';
import ReactionComponent from '../ReactionComponent';
import {TbHeartPlus} from 'react-icons/tb';
export interface ReactionButtonProps{
    username: string;
    targetId: string;
    variant?: string;
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
    _ Note for idea for the reaction btn:
        + We can make the reacted button and transform it into the actual reaction button, so the list will shrink, leaving the reacted reaction button, this button will the be shrunk back to normal size  
    _ State of a reaction of an item:
        a. No reaction yet: reacted = false, reaction = null
        b. Reacted: reacted = true, reaction = Reaction object
        c. Unreacted: reacted = true, reaction.name = ''
*/
const REACTION_EXPIRE_TIME = 1000 * 60 * 15;//15 minutes in miliseconds used to set the expireAt field in the reaction document, to create a date from now, use new Date(Date.now() + REACTION_EXPIRE_TIME)
export default function ReactionButton(
    {
        username,
        targetId,
        variant
    }: ReactionButtonProps
){
    const [reacted, setReacted] = useState(false);
    const [reaction, setReaction] = useState<Reaction>();
    const [revealed, setRevealed] = useState(false);
    const [reactionStatus, setReactionStatus] = useState("no-reaction");
    const [buttonState, setButtonState] = useState('') //unrevealed, revealed-reacted, revealed-unreacted, revealed-no-reaction
        //reaction.name == '' means no reaction, this happen when the user reacted and then unreacted
    const handleAddReaction = async (reactionName: string, username: string, targetId: string) => {
            const oldReaction = {...reaction!};//guarantee to be not null, since this function is called when the reaction is set
            const newReaction = {
                username,
                targetId,
                name : reactionName,
                createdDate: new Date(),
                updatedDate: new Date(),

            }
            setReacted(true);
            setReaction(newReaction);
            const path = `reactions/post-reaction`;
           
            const response = await insertToPostAPI(path, newReaction);
            if(response.message !== "success"){
                setReacted(false);
                setReaction(oldReaction);
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
        if(response.message !== 'success'){
            setReaction(oldReaction);
        }  

    }
    const handleFetchInitialReaction = async (path: string, params: ReactionFetchParams) => {
        try{
            const reaction = await fetchFromGetAPI(path, params);
            if(reaction){
                setReaction(reaction);
                setReacted(true);
                
            } else {
                setReacted(false);
            }
        }catch(err){
            setReacted(false);
        }
        
    }
    const handleReactionButton = async (username: string, targetId: string) => {
        if(!revealed){
            setRevealed(true);    
        } else {
            handleUnReaction(username, targetId);
            setRevealed(false);
        }

        
    }
    const handleReactionIconClick = (reactionName: string, reacted: boolean, username: string, targetId: string) => {
        if(!reacted){
            handleAddReaction(reactionName, username, targetId);
        } else {
            handleUpdateReaction(reactionName, username, targetId);
        }
        setRevealed(false);
    }
    const handleUnReaction = (username: string, targetId: string) => {
        handleUpdateReaction('', username, targetId);
        setRevealed(false);
    }
    const handleOutterClick = (event: any) => {
        if(!event.target.closest(`.${style['reaction-button']}`)){
            setRevealed(false);
        } 
    }
    const handleSettingReactionButtonWidth = () => {
        const reactionButton = document.querySelector(`.${style['reaction-button']}`) as HTMLElement;
        const reactionButtonContainer = document.querySelector(`.${style['reaction-button-container']}`) as HTMLElement;
        if(reactionButton && reactionButtonContainer){
            const reactionButtonRect = reactionButton.getBoundingClientRect();
            reactionButtonContainer.style.width = `${reactionButtonRect.width}px`;
        }
    }
    useEffect(()=>{

        handleFetchInitialReaction(`reactions/get-reaction`, {username, targetId});
        handleSettingReactionButtonWidth();
        document.addEventListener('click', handleOutterClick);
        return () => {
            document.removeEventListener('click', handleOutterClick);
        }

    },[])
    useEffect(()=>{
        if(reacted && reaction && reaction.name !== ''){
            setReactionStatus("reacted");
        } else if (reacted && reaction && reaction.name === ''){
            setReactionStatus("unreacted");
        } else {
            setReactionStatus("no-reaction");
        }
    }, [reacted, reaction])
    useEffect(()=>{
        if(revealed && reactionStatus === 'no-reaction'){
            setButtonState('revealed-noreaction');
        } else if (revealed && reactionStatus === 'reacted'){
            setButtonState('revealed-reacted');
        } else if (revealed && reactionStatus === 'unreacted'){
            setButtonState('revealed-unreacted');
        } else if(!revealed && reactionStatus === 'reacted') {
            setButtonState('unrevealed-reacted');
        } else {
            setButtonState('');
        }
    }, [revealed])
    return (
        <div className={style['reaction-button-container']}>
            {/* 
                TODO: a button that initially tell user to react if user have not reacted yet, once reacted it will be updated with the reacted reaction
                Once clicked, a list of reaction will be displayed, the user can choose the reaction they want, should be in a form of 
             */}
            {/*     _ State of a reaction of an item:
            a. No reaction yet: reacted = false, reaction = null
            b. Reacted: reacted = true, reaction = Reaction object
            c. Unreacted: reacted = true, reaction.name = '' */}
            <button 
                    className={ 
                        style['reaction-button'] + " " + 
                        (variant && style[variant]) + " " +
                        (style[buttonState])} 
                    onClick={()=>handleReactionButton(username, targetId)}
                >
                    
                           { reactionStatus === 'reacted' &&<span className={style["slash"]}>

                            </span>}
                            <span className={style["reaction-button__reaction-icon"]}>
                                 {reactionStatus === 'reacted' ? REACTION_ICON_MAP[reaction?.name!] : <TbHeartPlus/>}
                            </span>
                            <span className={style["reaction-button__reaction-name"]}>
                                {reactionStatus === 'reacted' ? reaction?.name : 'React'}
                            </span>

            </button>
            <div className={style["reaction-list-container"] + " " + (variant && style[variant])}>
                <div className={style['dummy-list']}>
                        <button className={style['reaction-icon-btn']}>
                            <ReactionComponent name="like" />
                        </button>
                </div>
                {<div className={style['reaction-button__reaction-list'] + " " + (revealed? style['revealed'] : "")}>

    {/*                 {reacted && reaction && reaction.name !== '' && <button
                        onClick={()=>handleUnReaction(username, targetId)}
                        className={style["reacted-icon-btn"]}>
                        <ReactionComponent name={reaction?.name} /> 
                    </button>} */}

                    <div className={style['reaction-icon-btns-group']}>
                    {
                        _.map(REACTION_TYPE_NAMES_LIST, (reactionName) => {
                            return (
                                <button 
                                    key={reactionName} 
                                    onClick={()=>{
                                    handleReactionIconClick(reactionName, reacted, username, targetId);
                                    }}
                                    className={style['reaction-icon-btn'] + " " + (reaction?.name == reactionName ? style['reacted'] : "")}
                                >                  
                                    <ReactionComponent name={reactionName} />
                                </button>
                            )
                        })
                    }
                    </div>
                </div>}
            </div>
           

        </div>
    )
}