import React from 'react';
import style from './mini-sun.module.css';

interface MiniSunProps {

}

const MiniSun: React.FC<MiniSunProps> = ({}) => {
    return (
        <div className={style['mini-sun']}>
        </div>
    );
};

export default MiniSun;