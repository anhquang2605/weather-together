import React from 'react';

interface CloudProps {
    cloudClassName?: string;
    variation: number; // 1, 2, 3, 4, 5
    style?: React.CSSProperties;
    boxSize?: number;
    index?: number;
}
/* 
    Cloud svgs for sky-scroller
*/
const Cloud: React.FC<CloudProps> = ({cloudClassName, variation, style,  boxSize,index}) => {
    const SvgCloudComponent = require(`./../../../../assets/svg/userProfile/sky/cloud${variation}.svg`).default;
    return (
        <div 
            key={index}
            style={{
            width: `${boxSize}px`,
            height: `${boxSize}px`,
            backgroundColor: 'red',
            border: '1px solid black',
        }}>
                <SvgCloudComponent style={style} />
        </div>

    );
};

export default Cloud;