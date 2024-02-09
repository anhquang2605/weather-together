import React from 'react';
import style from './sky-lane.module.css';

interface SkyLaneProps {

}

const SkyLane: React.FC<SkyLaneProps> = ({}) => {
    return (
        <div className={style['sky-lane']}>
            SkyLane
        </div>
    );
};

export default SkyLane;