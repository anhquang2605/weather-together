import React, { useEffect, useRef, useState } from 'react';
import style from './moving-clouds.module.css';

interface MovingCloudsProps {
    size?: number;
    //sizeString?: string; //sm, md, lg
    speed?: number; /* between 0.1 to 3 */
    color?: string;
    isMoving: boolean;
    distance?: number;
    initialLeft?: number;
    initialTop?: number;
    setObjWidth: React.Dispatch<number>;
    containerWidth: number;
}

const MovingClouds: React.FC<MovingCloudsProps> = ({
    size = 100,
    color = "white",
    speed = 1,
    isMoving,
    distance = 1,
    initialLeft = 0,
    initialTop = 0,
    setObjWidth,
    containerWidth
}) => {
    const SvgCloud  =  require('./../../../../../../../assets/svg/weatherbar/cloud.svg').default;
    const ref = useRef<HTMLDivElement | null>(null);
    const [animationId, setAnimationId] = useState<number>(0);
    const [position, setPosition] = useState<number>(0);
    const requestRef = useRef<number>(0);
    let endPos = 200;
    const move = () => {
        const curRef = ref.current;
        if(curRef){
            let transformRule = curRef.style.transform;
            let firstSub = transformRule.substring(11);
            let curPos = parseFloat(firstSub.replace("px)",""));
            if(curPos >= (containerWidth - size)){//reset when pass the boundaries
                curRef.style.left = "0px";
                setPosition(0);
            }else{
                setPosition(prev => prev + (speed));
            }
        }
        requestRef.current = requestAnimationFrame(move);
    }
    const setInitialPosition = (cloud: HTMLDivElement,left: number, top: number) => {
        if(cloud){
           cloud.style.left = left + "px";
           cloud.style.top = top + "px"; 
        }
    }
    const obtainAndSetCloudHeight = (refCurrent: HTMLDivElement) => {
        const boxWidth = refCurrent.getBoundingClientRect().width;
        setObjWidth(boxWidth);
    }
    useEffect(()=>{
        if(initialLeft > 0 && initialTop > 0 && ref.current){
            setInitialPosition(ref.current, initialLeft, initialTop);
        }
    },[initialLeft,initialTop, ref.current])
    useEffect(()=>{
        if(ref.current){
            obtainAndSetCloudHeight(ref.current);
        }
    },[size])
    useEffect(()=>{
        if(isMoving){
            requestRef.current = requestAnimationFrame(move)
        }else{
            window.cancelAnimationFrame(requestRef.current);
        }
        return ()=> {
            cancelAnimationFrame(requestRef.current);
        }
    },[isMoving])
    return (
        <div style={{
            opacity: distance,
            transform: `translateX(${position}px)`
        }} ref = {ref} className={style['moving-clouds']}>
            <svg height={size} viewBox="0 0 83 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_3_5)">
                <path d="M68.82 18.186C68.9953 17.2538 69.0868 16.292 69.0868 15.3084C69.0868 6.85382 62.3206 0 53.9739 0C48.867 0 44.3516 2.56586 41.6161 6.49442C38.9896 4.261 35.6022 2.91589 31.9048 2.91589C23.6382 2.91589 16.9219 9.63869 16.7938 17.9812H16.7919C7.51792 17.9812 0 25.5964 0 34.9906C0 44.3847 7.51792 52 16.7919 52H66.2082C75.482 52 83 44.3847 83 34.9906C83 26.4964 76.8535 19.4569 68.82 18.186Z" fill={color}/>
                </g>
            </svg>
        </div>
    );
};

export default MovingClouds;