import React from 'react';
import style from './bar-liquid.module.css';

interface BarLiquidProps {
    progress?: number // 0 - 1
    side?: 'left' | 'right'
}

const BarLiquid: React.FC<BarLiquidProps> = ({progress = 0, side = 'left'}) => {
    return (
        <div className={style['bar-liquid'] + ' ' + style[side]}>
            
        </div>
    );
};

export default BarLiquid;