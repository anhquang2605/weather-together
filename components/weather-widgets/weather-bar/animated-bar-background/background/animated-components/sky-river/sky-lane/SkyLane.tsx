import React from 'react';
import style from './sky-lane.module.css';
import MovingClouds from '../../moving-clouds/MovingClouds';



interface SkyLaneProps {
    widthSize?: string; // full, half, double, one-half
    zDistance?: number; // between 0 to 1
    speed?: number;
}

const SkyLane: React.FC<SkyLaneProps> = ({
    widthSize = "full",
    speed = 1
}) => {
    /**
     * Get randomized coordinates contained within the box
     * @param boxWidth 
     * @param boxHeight
     * @returns x and y coordinates relatively to the box
     */
    const getRandomLocation = (boxWidth : number, boxHeight: number) => {

    }
    return (
        <div className={`${style['sky-lane']} ${style[widthSize]}`}>
            <MovingClouds speed = {0.1} isMoving={true} />
        </div>
    );
};

export default SkyLane;