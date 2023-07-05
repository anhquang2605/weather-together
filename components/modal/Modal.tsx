import React from 'react';
import {useState,useEffect} from 'react';
import styles from './modal.module.css'
import {IoClose} from 'react-icons/io5'
interface ModalProps {
    children?: React.ReactNode
    status?: boolean
    onClose?: () => void
}
/*
    To  use this, provide a state from the parent component as status,
    keep track of this state in the parent component and pass a function
    to the onClose prop to set the state to false which will close the modal
    to open the modal, set the state to true, should be passed into status prop
*/
export default function Modal({children, onClose,status}: ModalProps) {
    const [reveal, setReveal] = useState(false);
    useEffect(() => {
        setReveal(status ?? false);
    }, [status])
    return(
        <div className={"fixed top-0 left-0 w-full h-full flex justify-center items-center " + (!reveal && "hidden")}>
            <div className={"backdrop-blur bg-gradient-to-b from-slate-900 via-transparent to-slate-900  w-full h-full absolute bottom-0 right-0"}></div>
            <div className={styles["modal-content"] + " border border-slate-400"}>
                <button onClick={onClose} className={styles["modal-close-btn"] + " drop-shadow-lg"}><IoClose></IoClose></button>
                {children}
            </div>
        </div>
    )
}