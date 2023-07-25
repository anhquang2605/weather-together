import React, {useEffect, useState} from 'react';
import style from './toggle-switch.module.css'
interface ToggleSwitchProps {
    onLabel: string;
    offLabel: string;
    setToggle: React.Dispatch<React.SetStateAction<boolean>>;
    on: boolean;
}

export default function ToggleSwitch({onLabel, offLabel, setToggle, on}: ToggleSwitchProps) {
    
    return(
        <div
            className={
                style["toggle-switch"] + 
                (on ? " " + style["toggled-on"] : "")
            }
            onClick={()=>setToggle(prevState => !prevState)}
        >
            <div className="toggle-label">
                {on ? onLabel : offLabel}
            </div>
            <div className={style['toggle-knob']}>
            </div>

        </div>
    )
}