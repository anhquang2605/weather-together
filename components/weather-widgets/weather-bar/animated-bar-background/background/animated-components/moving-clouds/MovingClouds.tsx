import React from 'react';
import style from './moving-clouds.module.css';

interface MovingCloudsProps {
    size?: number;
    //sizeString?: string; //sm, md, lg
    speed?: number; /* between 0.1 to 3 */
    color?: string;
}

const MovingClouds: React.FC<MovingCloudsProps> = ({
    size = 100,
    color = "white",
    speed = 1
}) => {
    const SvgCloud  =  require('./../../../../../../../assets/svg/weatherbar/cloud.svg').default;

    return (
        <div className={style['moving-clouds']}>
            <svg width="83" height="52" viewBox="0 0 83 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_3_5)">
                <path d="M68.82 18.186C68.9953 17.2538 69.0868 16.292 69.0868 15.3084C69.0868 6.85382 62.3206 0 53.9739 0C48.867 0 44.3516 2.56586 41.6161 6.49442C38.9896 4.261 35.6022 2.91589 31.9048 2.91589C23.6382 2.91589 16.9219 9.63869 16.7938 17.9812H16.7919C7.51792 17.9812 0 25.5964 0 34.9906C0 44.3847 7.51792 52 16.7919 52H66.2082C75.482 52 83 44.3847 83 34.9906C83 26.4964 76.8535 19.4569 68.82 18.186Z" fill={color}/>
                </g>
            </svg>
        </div>
    );
};

export default MovingClouds;