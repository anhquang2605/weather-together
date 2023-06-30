import React from 'react';
import {useState,useEffect} from 'react';
import styles from './modal.module.css'
interface ModalProps {
    children?: React.ReactNode
    status?: boolean
}
export default function Modal({children,status}: ModalProps) {
    const [reveal, setReveal] = useState(true);
    return(
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
            <div className={"backdrop-blur bg-slate-900 bg-opacity-70 w-full h-full absolute bottom-0 right-0"}></div>
            <div className={styles["modal-content"]}>
                <button className="modal-close-btn"></button>
                {children}
            </div>
        </div>
    )
}