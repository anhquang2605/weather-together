import React from 'react';
import style from './confirmation-box.module.css';

interface ConfirmationBoxProps {
    confirmHandler: () => void,
    cancelHandler: () => void,
    confirmText: string,
}

const ConfirmationBox: React.FC<ConfirmationBoxProps> = ({
    confirmHandler,
    cancelHandler,
    confirmText,
}) => {
    return (
        <div className={style['confirmation-box']}>
            <h1>
                {
                    confirmText
                }
            </h1>
            <div className={style['confirmation-box__buttons']}>
                <button className={style['confirm-btn'] + " action-btn"} onClick={confirmHandler}>Yes</button>
                <button className={style['cancel-btn'] + " critical-btn"} onClick={cancelHandler}>No</button>
            </div>
        </div>
    );
};

export default ConfirmationBox;