import React from 'react';
import style from './sky-river.module.css';

interface SkyRiverProps {
    noOfLane?: number;
    uniqueObject?: React.ReactNode;// the object that would spawn in random lane

}

const SkyRiver: React.FC<SkyRiverProps> = ({}) => {
    const spawnLane = (laneNumber: number) => {
        const lanes = [];
        for (let i = 0; i < laneNumber; i++) {
            lanes.push(
                <SkyLane key={i}/>
            );
        }
    };
    return (
        <div className={style['sky-river']}>
            <SkyRiverLane/>
        </div>
    );
};

export default SkyRiver;