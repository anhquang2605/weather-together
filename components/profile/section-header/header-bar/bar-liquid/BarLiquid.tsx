import React, { useEffect, useState } from 'react';
import style from './bar-liquid.module.css';

interface BarLiquidProps {
    progress?: number // 0 - 1
    containerClassName?: string;//for width calculation
    id: number;
    nextIndex: number
    currentIndex: number
}
const OFFSET_TO_SIDE = 4; //px
const BarLiquid: React.FC<BarLiquidProps> = ({progress = 0, containerClassName, id, nextIndex, currentIndex}) => {
    const [side, setSide] = useState('left');
    const [containerWidth, setContainerWidth] = useState(0);
    const [progressWidth, setProgressWidth] = useState(0);
    const [isCurrent, setIsCurrent] = useState(false);
    const getContainerWidth = () => {
        if (!containerClassName) return 0;
        const container = document.querySelector('.' + containerClassName);
        if (!container) return 0;
        return container.getBoundingClientRect().width;
    }
    const updateBarLiquid = () => {

        const width = (containerWidth + OFFSET_TO_SIDE * 2) * progress ;
        const barLiquid: HTMLElement | null = document.querySelector('#bar-liquid' + '-' + id);
        if (!barLiquid) return;
        barLiquid.style.width = width + 'px';
    }
    const styleObject = {
        [side] : - OFFSET_TO_SIDE + 'px'
    }
    useEffect(()=>{
        setContainerWidth(getContainerWidth())
        
    },[])
    useEffect(()=>{
        if(currentIndex < nextIndex){
            setIsCurrent(id === currentIndex);
        }
        else if(currentIndex > nextIndex) {
            setIsCurrent(id === nextIndex);
        }
    },[currentIndex, nextIndex])
    useEffect(()=>{
        if(!containerWidth || !isCurrent || !progress) return; 
        updateBarLiquid();
    },[containerWidth, progress])
    useEffect(()=>{
        if(isCurrent
        ){
            if(nextIndex < currentIndex){
                setSide('right');
            } else {
                setSide('left');
            }
            /* setSide( prev => {
                return prev === 'left' ? 'right' : 'left'
            }) */
        }
    },[isCurrent, nextIndex, currentIndex])
    return (
        <div style={styleObject} id={'bar-liquid-' + id + ''} className={style['bar-liquid'] +  ' ' + (isCurrent ? style['current'] : '')}>
            
        </div>
    );
};

export default BarLiquid;