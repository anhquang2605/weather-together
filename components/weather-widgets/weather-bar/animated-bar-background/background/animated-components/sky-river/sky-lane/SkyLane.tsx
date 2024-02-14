import React, { useEffect, useRef, useState } from 'react';
import style from './sky-lane.module.css';
import MovingClouds from '../../moving-clouds/MovingClouds';
import { useWeatherBarContext } from '../../../../../useWeatherBarContext';



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
    const {isHovered} = useWeatherBarContext();
    const [objWidth, setObjWidth] = useState<number>(0);
    const [objHeight, setObjHeight] = useState<number>(0);
    const [cloudWidth, setCloudWidth] = useState<number>(0);
    const ref = useRef<HTMLDivElement|null>(null);
    const getRandomXYCoordinates = (boxWidth : number, boxHeight: number, objectWidth: number, objectHeight: number) => {
        const xPositionRange = boxWidth - objectWidth;
        const yPositionRange = boxHeight - objectHeight;
        return {
            x: Math.random() * xPositionRange,
            y: Math.random() * yPositionRange
        }
    }
    const getRandomSize = (max: number, min: number) => {
        return Math.random()*max + min; 
    }
    const getRandomPosition = () => {

    }
    useEffect(()=>{

    }, [])
    useEffect(()=>{
        if(objHeight > 0){
            console.log(objHeight);
        }
    },[objHeight])
    return (
        <div ref={ref} className={`${style['sky-lane']} ${style[widthSize]}`}>
            <MovingClouds setObjHeight={setObjHeight} speed = {0.025} isMoving={isHovered} />
        </div>
    );
};

export default SkyLane;