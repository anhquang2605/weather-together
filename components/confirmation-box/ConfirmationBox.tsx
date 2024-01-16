import React from 'react';
import style from './confirmation-box.module.css';

interface ConfirmationBoxProps {
    confirmHandler: () => void | Promise<void>,
    cancelHandler: () => void | Promise<void>,
    confirmText: string,
    conFirmButtonText?: string,
    cancelButtonText?: string,
}

const ConfirmationBox: React.FC<ConfirmationBoxProps> = ({
    confirmHandler,
    cancelHandler,
    confirmText,
    conFirmButtonText = "Yes",
    cancelButtonText = "No"
}) => {
    return (
        <div className={style['confirmation-box']}>
            <h1>
                {
                    confirmText
                }
            </h1>
            <div className={style['confirmation-box__buttons']}>
                <button className={style['confirm-btn'] + " action-btn"} onClick={confirmHandler}>{conFirmButtonText}</button>
                <button className={style['cancel-btn'] + " critical-btn"} onClick={cancelHandler}>{cancelButtonText}</button>
            </div>
        </div>
    );
};

export default ConfirmationBox;