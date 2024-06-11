import React from 'react';
import style from './mini-sun.module.css';

interface MiniSunProps {

}

const MiniSun: React.FC<MiniSunProps> = ({}) => {
    return (
        <div className={style['mini-sun']}>
            MiniSun
        </div>
    );
};

export default MiniSun;