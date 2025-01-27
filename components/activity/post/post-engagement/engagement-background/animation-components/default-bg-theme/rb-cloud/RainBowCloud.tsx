import React from 'react';
import style from './rainbow-cloud.module.css';

interface RainBowCloudProps {

}

const RainBowCloud: React.FC<RainBowCloudProps> = ({}) => {
    return (
        <div className={style['rainbow-cloud']}>
            RainBowCloud
        </div>
    );
};

export default RainBowCloud;