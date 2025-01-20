import React from 'react';
import style from './rain-cloud.module.css';

interface RainCloudProps {

}

const RainCloud: React.FC<RainCloudProps> = ({}) => {
    return (
        <div className={style['rain-cloud']}>
            RainCloud
        </div>
    );
};

export default RainCloud;