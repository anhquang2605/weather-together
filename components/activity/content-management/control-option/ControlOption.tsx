import React from 'react';
import style from './control-option.module.css';
import {IoEllipsisHorizontal} from 'react-icons/io5';
import {TbEdit, TbBookmarkPlus, TbTrash} from 'react-icons/tb';
interface ControlOptionProps {
    title: string;
    description?: string;
    onClick?: () => void;
}
const getIconJSX = (title: string) => {

    //future consideration, make each icon animated and associated with a type of weather 
    switch(title){
        case 'Edit':
            return (//fulte
                <TbEdit/>
            );
        case 'Delete':
            return (
                <TbTrash/>
            );
        case 'Save':
            return (
                <TbBookmarkPlus/>
            );
        default:
            return (
                null
            );
    }
}
const ControlOption: React.FC<ControlOptionProps> = ({
    title,
    description,
    onClick
}) => {
    return (
        <button
        onClick={onClick}
        className={style['control-option']}>
            <span className={style['icon']}>
                {
                    getIconJSX(title)
                }
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