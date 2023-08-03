import style from "./interactions-btns.module.css";
import ReactionButton from "./../reaction/reaction-button/ReactionButton";

export interface InteractionsBtnsProps {
    targetId: string;
    username: string;
}
export default function InteractionsBtns({ targetId, username }: InteractionsBtnsProps) {
    return(
        <div className={style['interactions-btns']}>
            {/* reaction, comment, and might be sharing or repost */}
            <ReactionButton 
                targetId={targetId}
                username={username}
            />
        </div>
    )

}