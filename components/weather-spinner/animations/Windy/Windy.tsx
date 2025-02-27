import React from 'react';
import style from './windy.module.css';

interface WindyProps {

}

const Windy: React.FC<WindyProps> = ({}) => {
    return (
        <div className={style['windy']}>
            Windy
        </div>
    );
};

export default Windy;