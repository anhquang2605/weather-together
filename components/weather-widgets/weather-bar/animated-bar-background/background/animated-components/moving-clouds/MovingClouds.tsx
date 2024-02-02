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
    
    const spawnClouds = (cloudNo : number) => {
        const clouds = [];
        for(let i = 0; i < cloudNo; i += 1){
            const SvgCloud = require("./../../../../../../../assets/svg/weatherbar/cloud.svg").default;
            clouds.push(
                <SvgCloud
                    id={"cloud-bg-weather-bar-"+ i}
                />
            );        
        }
        return clouds;
    }
    return (
        <div className={style['moving-clouds']}>
            <div className="frame">
                    {
                        spawnClouds(noOfClouds)
                    }
            </div>    
        </div>
    );
};

export default MovingClouds;