import { Reaction } from '../../../types/Reaction';
import style from './reaction.module.css'
import { REACTION_ICON_MAP } from './reaction-icon-map';
interface ReactionProps{
    name: string;
    count?: number;
}
export default function ReactionComponent (
    {
        name,
        count
    }: ReactionProps
) {
    return (
        <div className={style['reaction']}>
            <div className={style['reaction__emoji']}>
                {REACTION_ICON_MAP[name]}
            </div>
            {count && <div className={style['reaction__count']}>

            </div>}
        </div>
    )
}
