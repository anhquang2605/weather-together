import React from 'react';
import {useState,useEffect} from 'react';
import styles from './modal.module.css'
import {IoClose} from 'react-icons/io5'
interface ModalProps {
    children?: React.ReactNode
    status?: boolean
    onClose?: () => void
    hideCloseButton?: boolean,
    containerClassName?: string,
    title?: string,
    size?: "sm" | "md" | "lg" | '' 
}
/*
    To  use this, provide a state from the parent component as status,
    keep track of this state in the parent component and pass a function
    to the onClose prop to set the state to false which will close the modal
    to open the modal, set the state to true, should be passed into status prop
*/
export default function Modal({children, onClose,status,hideCloseButton,containerClassName,title, size = ''}: ModalProps) {
    const [reveal, setReveal] = useState(false);
    useEffect(() => {
        setReveal(status ?? false);
    }, [status])
    return(
        <div className={styles['modal'] + " " + (!reveal && styles["hidden"]) + " " + styles[size]}>
            <div onClick={onClose} className={"backdrop-blur-lg bg-gradient-to-b from-slate-900 via-transparent to-slate-900  w-full h-full absolute bottom-0 right-0"}></div>
            <div className={styles["modal-content"] + " border border-slate-400 " + (containerClassName ?? "")}>
                {title && title.length > 0 && <h3 className="form-title">{title}</h3>}
                {!hideCloseButton && <button onClick={onClose} className={styles["modal-close-btn"] + " drop-shadow-lg"}><IoClose
                ></IoClose></button>}
                {children}
            </div>

        </div>
    )
}