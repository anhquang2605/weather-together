import React from 'react';

interface CloudProps {
    cloudClassName?: string;
    variation: number; // 1, 2, 3, 4, 5
    width: number;
    height: number;
    style?: React.CSSProperties;
}
/* 
    Cloud svgs for sky-scroller
*/
const Cloud: React.FC<CloudProps> = ({cloudClassName, variation, width, style, height}) => {
    const SvgCloudComponent = require(`./../../../../assets/svg/userProfile/sky/cloud${variation}.svg`).default;
    return (
        <div className="w-full h-full">
            <SvgCloudComponent width={width} className={cloudClassName}/>
        </div>
    );
};

export default Cloud;