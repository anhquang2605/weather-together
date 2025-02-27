import React from 'react';
import style from './rainy.module.css';

interface RainyProps {

}

const Rainy: React.FC<RainyProps> = ({}) => {
    return (
        <div className={style['rainy']}>
            Rainy
        </div>
    );
};

export default Rainy;