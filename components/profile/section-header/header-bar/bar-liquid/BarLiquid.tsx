import React from 'react';
import style from './bar-liquid.module.css';

interface BarLiquidProps {

}

const BarLiquid: React.FC<BarLiquidProps> = ({}) => {
    return (
        <div className={style['bar-liquid']}>
            BarLiquid
        </div>
    );
};

export default BarLiquid;