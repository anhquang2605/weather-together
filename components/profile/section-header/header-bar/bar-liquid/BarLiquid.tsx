import React, { useEffect, useState } from 'react';
import style from './bar-liquid.module.css';

interface BarLiquidProps {
    progress?: number // 0 - 1
    containerClassName?: string;//for width calculation
    isCurrent?: boolean
    id: number;
}
const OFFSET_TO_SIDE = 4; //px
const BarLiquid: React.FC<BarLiquidProps> = ({progress = 0, containerClassName, isCurrent = false, id}) => {
    const [side, setSide] = useState('left');
    const [containerWidth, setContainerWidth] = useState(0);
    const [progressWidth, setProgressWidth] = useState(0);
    const getContainerWidth = () => {
        if (!containerClassName) return 0;
        const container = document.querySelector('.' + containerClassName);
        if (!container) return 0;
        return container.getBoundingClientRect().width;
    }
    const updateBarLiquid = () => {
        const width = (side === 'left' ? 1 : -1) *(containerWidth + OFFSET_TO_SIDE * 2) * progress ;
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
        if(!containerWidth || !isCurrent || !progress) return; 
        updateBarLiquid();
    },[containerWidth, progress])
    useEffect(()=>{
        if(!isCurrent){
            setSide( prev => {
                return prev === 'left' ? 'right' : 'left'
            })
        }
    },[isCurrent])
    return (
        <div style={styleObject} id={'bar-liquid-' + id + ''} className={style['bar-liquid'] +  ' ' + (isCurrent ? style['current'] : '')}>
            
        </div>
    );
};

export default BarLiquid;