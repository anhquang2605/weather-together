import React from 'react';
import style from './loading-icon.module.css';
import {AiOutlineLoading3Quarters} from 'react-icons/ai'
interface LoadingIconProps {

}

const LoadingIcon: React.FC<LoadingIconProps> = ({}) => {
    return (
        <div className={style['loading-icon']}>
            <AiOutlineLoading3Quarters className="icon"/>
        </div>
    );
};

export default LoadingIcon;