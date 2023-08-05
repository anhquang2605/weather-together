import style from "./interactions-btns.module.css";
import ReactionButton from "./../reaction/reaction-button/ReactionButton";
import {IoChatboxEllipses, IoShare} from 'react-icons/io5';
export interface InteractionsBtnsProps {
    targetId: string;
    username: string;
    targetStyle: string; //extended or shrinked
}
export default function InteractionsBtns({ targetId, username, targetStyle }: InteractionsBtnsProps) {
    return(
        <div className={style['interactions-btns'] + " " + style[targetStyle]}>
            {/* reaction, comment, and might be sharing or repost */}
            <ReactionButton 
                targetId={targetId}
                username={username}
            />
            <button className="flex flex-row items-center"><IoChatboxEllipses className="icon mr-2"/>Comment</button>
            <button className="flex flex-row items-center">
                <IoShare className="icon mr-2"/>
                Share
            </button>
        </div>
    )

}