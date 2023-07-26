import React, {useEffect, useState} from 'react';
import style from './toggle-switch.module.css'
interface ToggleSwitchProps {
    onLabel: string;
    offLabel: string;
    setToggle: React.Dispatch<React.SetStateAction<boolean>>;
    on: boolean;
    onClassName?: string;
    offClassName?: string;
    onKnot? : JSX.Element;
    offKnot? : JSX.Element;
}

export default function ToggleSwitch({onLabel, offLabel, setToggle, on, onClassName, offClassName, onKnot, offKnot}: ToggleSwitchProps) {
    
    return(
        <div className={style['toggle-switch-container']  + " " +                
        (on ? (onClassName ?? style["toggled-on"]) : "" )}>
            <div
                className={
                    style["toggle-switch"]
                }
                onClick={()=>setToggle(prevState => !prevState)}>
                <div className={style['toggle-knob']}>
                    {onKnot && offKnot && (on ? onKnot : offKnot)}
                </div>
            </div>
            <div className={style["toggle-label"]}>
                    {on ? onLabel : offLabel}
             </div>
        </div>  

    )
}