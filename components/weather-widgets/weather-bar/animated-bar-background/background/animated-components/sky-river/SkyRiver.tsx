import React from 'react';
import style from './sky-river.module.css';
import SkyLane from './sky-lane/SkyLane';

interface SkyRiverProps {
    noOfLane?: number;
    uniqueObject?: React.ReactNode;// the object that would spawn in random lane
    laneConfigs?: LaneOptionI[];//array contain config for each lane, array length should match with number of lanes
}
interface LaneOptionI{
    speed: number;
    zDistance: number; //how far the spawn object is from the screen, between 0 and 1, 1 is closest to the screen 
}
const SkyRiver: React.FC<SkyRiverProps> = ({
    noOfLane = 1,
    laneConfigs = []
}) => {
    const GRID_WIDTH = 50; //AVOID object spawn in same y axis
    const spawnLane = (laneNumber: number) => {
        const lanes = [];

        for (let i = 0; i < laneNumber; i++) {
            
            const {speed, zDistance} = laneConfigs[i] ?? {
                speed: 1,
                zDistance: 1
            };

            lanes.push(
                <SkyLane 
                    speed = {speed}
                    zDistance={zDistance}
                   
                 key={i}/>
            );
        }
        return lanes;
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