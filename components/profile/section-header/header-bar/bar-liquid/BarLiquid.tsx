import React, { useEffect, useState } from 'react';
import style from './bar-liquid.module.css';

interface BarLiquidProps {
    progress?: number // 0 - 1
    side?: 'left' | 'right';
    containerClassName?: string;//for width calculation
    isCurrent?: boolean
}
const OFFSET_TO_SIDE = 4; //px
const BarLiquid: React.FC<BarLiquidProps> = ({progress = 0, side = 'left', containerClassName, isCurrent = false}) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const [progressWidth, setProgressWidth] = useState(0);
    const getContainerWidth = () => {
        if (!containerClassName) return 0;
        const container = document.querySelector('.' + containerClassName);
        if (!container) return 0;
        return container.getBoundingClientRect().width;
    }
    const updateBarLiquid = () => {
        const width = (containerWidth + OFFSET_TO_SIDE * 2) * progress ;
        const barLiquid: HTMLElement | null = document.querySelector('.' + style['bar-liquid']);
        if (!barLiquid) return;
        barLiquid.style.width = width + 'px';
    }
    const styleObject = {
        [side] : - OFFSET_TO_SIDE + 'px'
    }
    useEffect(()=>{
        setContainerWidth(getContainerWidth())
        
    },[])

    return (
        <div style={styleObject} className={style['bar-liquid'] + ' ' + style[side] + (isCurrent ? ' ' + style['current'] : '')}>
            
        </div>
    );
};

export default BarLiquid;