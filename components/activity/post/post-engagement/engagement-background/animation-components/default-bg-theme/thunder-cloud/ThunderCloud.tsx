import React from 'react';
import style from './thunder-cloud.module.css';

interface ThunderCloudProps {

}

const ThunderCloud: React.FC<ThunderCloudProps> = ({}) => {
    return (
        <div className={style['thunder-cloud']}>
            ThunderCloud
        </div>
    );
};

export default ThunderCloud;