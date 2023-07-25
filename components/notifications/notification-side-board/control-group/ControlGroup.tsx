import React, {useEffect} from 'react';
import style from './control-group.module.css'
import ToggleSwitch from '../../../plugins/toggle-switch/ToggleSwitch';
interface ControlGroupProps {
    setFilterRead: React.Dispatch<React.SetStateAction<boolean>>;
    filterRead: boolean;
    setAllRead: () => void;
}
export default function ControlGroup({setFilterRead, setAllRead, filterRead}: ControlGroupProps) {

    return(
        <div
            className={style['control-group']}
        >
            <ToggleSwitch 
                onLabel="Unread"
                offLabel="All"
                setToggle={setFilterRead}
                on={filterRead}
            />
        </div>
    )
}