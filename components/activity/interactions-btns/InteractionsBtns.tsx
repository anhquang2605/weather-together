import style from "./interactions-btns.module.css";
import ReactionButton from "./../reaction/reaction-button/ReactionButton";
import {IoChatboxEllipses, IoShare} from 'react-icons/io5';
export interface InteractionsBtnsProps {
    targetId: string;
    username: string;
    variant: string; //extended or shrinked
    handleCommentBtnClick: () => void;
}
export default function InteractionsBtns({ targetId, username, variant, handleCommentBtnClick }: InteractionsBtnsProps) {
    return(
        <div className={style['interactions-btns'] + " " + style[variant]}>
            {/* reaction, comment, and might be sharing or repost */}
            <ReactionButton 
                targetId={targetId}
                username={username}
                variant={variant === 'shrinked' ? 'shrink' : undefined}
            />
            <button 
                className="flex flex-row items-center"
                onClick={
                    () => {
                        handleCommentBtnClick();
                    }
                }
            >    
                <IoChatboxEllipses className="icon mr-2"/>
                    Comment
            </button>
            {variant !== 'shrinked' && <button className="flex flex-row items-center">
                <IoShare className="icon mr-2"/>
                Share
            </button>}
        </div>
    )

}