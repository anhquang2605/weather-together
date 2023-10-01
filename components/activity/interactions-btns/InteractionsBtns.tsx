import style from "./interactions-btns.module.css";
import ReactionButton from "./../reaction/reaction-button/ReactionButton";
import {IoChatboxEllipses, IoShare} from 'react-icons/io5';
export interface InteractionsBtnsProps {
    targetId: string;
    username: string;
    variant: string; //extended or shrinked
    handleCommentBtnClick: () => void;
    canComment?: boolean;
    noReactionName?: boolean;
}
export default function InteractionsBtns({ targetId, username, variant, handleCommentBtnClick, canComment, noReactionName }: InteractionsBtnsProps) {
    return(
        <div className={style['interactions-btns'] + " " + style[variant]}>
            {/* reaction, comment, and might be sharing or repost */}
            <ReactionButton 
                targetId={targetId}
                username={username}
                variant={variant === 'shrinked' ? 'shrink' : undefined}
                noReactionName={noReactionName}
            />
            {canComment && <button 
                className={`flex flex-row items-center ${style['interaction-btn']}`}
                onClick={
                    () => {
                        handleCommentBtnClick();
                    }
                }
            >    
                {variant === "shrinked" ? "Reply" : 
                <>
                    <IoChatboxEllipses className="icon mr-2"/>
                    Comment
                </>
                }
            </button>}
            {variant !== 'shrinked' && <button className={`flex flex-row items-center ${style['interaction-btn']}`}>
                <IoShare className="icon mr-2"/>
                Share
            </button>}
        </div>
    )

}