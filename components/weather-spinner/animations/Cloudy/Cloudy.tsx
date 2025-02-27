import React from 'react';
import style from './cloudy.module.css';

interface CloudyProps {

}

const Cloudy: React.FC<CloudyProps> = ({}) => {
    return (
        <div className={style['cloudy']}>
            Cloudy
        </div>
    );
};

export default Cloudy;