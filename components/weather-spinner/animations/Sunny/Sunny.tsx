import React from 'react';
import style from './sunny.module.css';

interface SunnyProps {

}

const Sunny: React.FC<SunnyProps> = ({}) => {
    return (
        <div className={style['sunny']}>
            Sunny
        </div>
    );
};

export default Sunny;