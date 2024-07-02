import React, { useEffect } from 'react';
import styles from './cloud.module.css'
interface CloudProps {
    cloudClassName: string;
    variation: number; // 1, 2, 3, 4, 5
    style: React.CSSProperties;
    boxSize?: number;
    index?: number;
    scale: number;
}
/* 
    Cloud svgs for sky-scroller
*/
const Cloud: React.FC<CloudProps> = ({cloudClassName, variation, style,  boxSize,index, scale}) => {
    const SvgCloudComponent = require(`./../../../../assets/svg/userProfile/sky/cloud${variation}.svg`).default;

    return (
        <div 
            key={index}
            style={{
            width: `${boxSize}px`,
            height: `${boxSize}px`,
            transform: `scale(${scale}) ${style.transform}`,
            transformOrigin: '0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
            className={cloudClassName + ' ' + styles.cloud}
        >
                <SvgCloudComponent/>
        </div>

    );
};

export default Cloud;