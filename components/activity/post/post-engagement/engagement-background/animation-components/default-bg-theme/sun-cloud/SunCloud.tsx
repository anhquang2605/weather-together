import React from 'react';
import style from './sun-cloud.module.css';

interface SunCloudProps {

}

const SunCloud: React.FC<SunCloudProps> = ({}) => {
    return (
        <div className={style['sun-cloud']}>
            SunCloud
        </div>
    );
};

export default SunCloud;