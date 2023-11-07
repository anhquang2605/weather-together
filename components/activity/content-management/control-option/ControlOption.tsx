import React from 'react';
import style from './control-option.module.css';

interface ControlOptionProps {
    title: string;
    description?: string;
    icon: JSX.Element;
    onClick?: (_id:string) => void;
}

const ControlOption: React.FC<ControlOptionProps> = ({
    title,
    description,
    icon,
    onClick
}) => {
    return (
        <button
        className={style['control-option']}>
            <span className={style['icon']}>

            </span>
            <span className={style['title']}>
                {title}
            </span>
            <span className={style['description']}>
                {description}
            </span>
        </button>
    );
};

export default ControlOption;