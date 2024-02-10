import React from 'react';
import style from './sky-lane.module.css';

interface SkyLaneProps {
    widthSize?: string; // full, half, double, one-half
    zDistance?: number; // between 0 to 1
}

const SkyLane: React.FC<SkyLaneProps> = ({
    widthSize = "full"
}) => {
    return (
        <div className={`${style['sky-lane']} ${style[widthSize]}`}>
            
        </div>
    );
};

export default SkyLane;