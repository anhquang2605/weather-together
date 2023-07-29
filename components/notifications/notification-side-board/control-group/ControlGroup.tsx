import React, {useEffect} from 'react';
import style from './control-group.module.css'
import ToggleSwitch from '../../../plugins/toggle-switch/ToggleSwitch';
import {IoCheckmarkDone} from "react-icons/io5";
interface ControlGroupProps {
    setFilterUnRead: React.Dispatch<React.SetStateAction<boolean>>;
    filterUnRead: boolean;
    setAllRead: () => void;
    unreads: number;
}
export default function ControlGroup({setFilterUnRead, setAllRead, filterUnRead, unreads}: ControlGroupProps) {

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
            {unreads > 0 && <button 
                onClick={setAllRead}
                className="ml-auto action-btn flex flex-row items-center">
                <IoCheckmarkDone className="icon mr-1"/>Mark all as read
            </button>}
        </div>
    )
}