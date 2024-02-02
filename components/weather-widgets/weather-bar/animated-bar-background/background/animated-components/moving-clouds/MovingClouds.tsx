import React from 'react';
import style from './moving-clouds.module.css';

interface MovingCloudsProps {
    noOfClouds?: number;
    cloudColor?: string;
    speed?: number; /* between 0.1 to 3 */
}

const MovingClouds: React.FC<MovingCloudsProps> = ({
    noOfClouds = 2,
    cloudColor = "white",
    speed = 1
}) => {
    const SvgCloud = require("./../../../../../../../assets/svg/weatherbar/cloud.svg").default;
    const spawnCloud = (cloudNo : number) => {
        
    }
    return (
        <div className={style['moving-clouds']}>
            <div className="frame">
                <SvgCloud> </SvgCloud>    
            </div>    
        </div>
    );
};

export default MovingClouds;