import React from 'react';
import style from './sky-river.module.css';
import SkyLane from './sky-lane/SkyLane';

interface SkyRiverProps {
    noOfLane?: number;
    uniqueObject?: React.ReactNode;// the object that would spawn in random lane

}

const SkyRiver: React.FC<SkyRiverProps> = ({
    noOfLane = 1,
}) => {
    const spawnLane = (laneNumber: number) => {
        const lanes = [];
        for (let i = 0; i < laneNumber; i++) {
            lanes.push(
                <SkyLane key={i}/>
            );
        }return lanes;
    };
    return (
        <div className={style['sky-river']}>
            {
                spawnLane(noOfLane)
            }
        </div>
    );
};

export default SkyRiver;