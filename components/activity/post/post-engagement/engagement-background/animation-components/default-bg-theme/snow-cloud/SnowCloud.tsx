import React from 'react';
import style from './snow-cloud.module.css';

interface SnowCloudProps {

}

const SnowCloud: React.FC<SnowCloudProps> = ({}) => {
    return (
        <div className={style['snow-cloud']}>
            SnowCloud
        </div>
    );
};

export default SnowCloud;