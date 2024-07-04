import React from 'react';
import style from './mini-sun.module.css';

interface MiniSunProps {
    isCurrent: boolean;
}

const MiniSun: React.FC<MiniSunProps> = ({isCurrent}) => {
    return (
        <div className={style['mini-sun'] + (isCurrent ? ' ' + style['current'] : '')}>
        </div>
    );
};

export default MiniSun;