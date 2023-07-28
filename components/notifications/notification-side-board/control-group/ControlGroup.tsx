import React, {useEffect} from 'react';
import style from './control-group.module.css'
import ToggleSwitch from '../../../plugins/toggle-switch/ToggleSwitch';
interface ControlGroupProps {
    setFilterUnRead: React.Dispatch<React.SetStateAction<boolean>>;
    filterUnRead: boolean;
    setAllRead: () => void;
}
export default function ControlGroup({setFilterUnRead, setAllRead, filterUnRead}: ControlGroupProps) {

    return(
        <div
            className={style['control-group']}
        >
            <ToggleSwitch 
                onLabel="Unread"
                offLabel="All"
                setToggle={setFilterUnRead}
                on={filterUnRead}
            />
        </div>
    )
}