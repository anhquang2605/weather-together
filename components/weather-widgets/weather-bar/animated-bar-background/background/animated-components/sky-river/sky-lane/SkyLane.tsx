import React, { useEffect, useRef, useState } from 'react';
import style from './sky-lane.module.css';
import MovingClouds from '../../moving-clouds/MovingClouds';
import { useWeatherBarContext } from '../../../../../useWeatherBarContext';



interface SkyLaneProps {
    widthSize?: string; // full, half, double, one-half
    zDistance?: number; // between 0 to 1
    speed?: number;
    isNight?: boolean;
    offset?: number;
}

const SkyLane: React.FC<SkyLaneProps> = ({
    widthSize = "full",
    speed = 1,
    isNight = false,
    offset = 100
}) => {
    /**
     * Get randomized coordinates contained within the box
     * @param boxWidth 
     * @param boxHeight
     * @returns x and y coordinates relatively to the box
     */
    const CLOUD_MIN_DISTANCE = 0.5;
    const {isHovered} = useWeatherBarContext();
    const [objWidth, setObjWidth] = useState<number>(0);
    const [objHeight, setObjHeight] = useState<number>(0);
    const [cloudWidth, setCloudWidth] = useState<number>(0);
    const [boxWidth, setBoxWidth] = useState<number>(0);
    const [boxHeight, setBoxHeight] = useState<number>(0);
    const [objLeft, setObjLeft] = useState<number>(0);
    const [objTop, setObjTop] = useState<number>(0);
    const [cloudDistance, setCloudDistance] = useState<number>(1);
    const ref = useRef<HTMLDivElement|null>(null);
    const getRandomXYCoordinates = (boxWidth : number, boxHeight: number, objectWidth: number, objectHeight: number) => {
        const xPositionRange = (boxWidth * 1/2) - objectWidth;
        const yPositionRange = boxHeight - objectHeight;
        return {
            x: Math.random() * xPositionRange + offset,
            y: Math.random() * yPositionRange
        }
    }
    const getRandomSize = (max: number, min: number) => {
        return Math.random()*max + min; 
    }
    const getAndSetRandomPosition = () => {
        const coordinate = getRandomXYCoordinates(
            boxWidth,boxHeight,objWidth,objHeight
        )
        setObjLeft(coordinate.x);
        setObjTop(coordinate.y);

    }
    const getAndSetBoxDimension = (box: HTMLDivElement) => {
        const {height,width} = box.getBoundingClientRect();
        setBoxHeight(height);
        setBoxWidth(width);
    }
    useEffect(()=>{
        if(ref.current){
            getAndSetBoxDimension(ref.current);
            setCloudDistance(Math.random() + CLOUD_MIN_DISTANCE)
        }
    }, [])
    useEffect(()=>{
        if(boxHeight > 0){
            const height = getRandomSize(boxHeight * 2/3 , boxHeight / 3);
            setObjHeight(height);
        }
    },[boxHeight])
    useEffect(()=>{
        if(objWidth > 0){
           getAndSetRandomPosition();
        }
    },[objWidth])
    return (
        <div ref={ref} className={`${style['sky-lane']} ${style[widthSize]}`}>
            <MovingClouds containerWidth={boxWidth} initialLeft= {objLeft} initialTop={objTop} size={objHeight} setObjWidth={setObjWidth} distance={
                cloudDistance
            } speed = {cloudDistance /5} isMoving={isHovered} />
        </div>
    );
};

export default SkyLane;