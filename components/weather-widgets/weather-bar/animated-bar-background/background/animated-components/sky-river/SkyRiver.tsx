import React from 'react';
import style from './sky-river.module.css';

interface SkyRiverProps {
    noOfLane?: number;
    uniqueObject?: React.ReactNode;// the object that would spawn in random lane
    
}

const SkyRiver: React.FC<SkyRiverProps> = ({}) => {
    return (
        <div className={style['sky-river']}>
            
        </div>
    );
};

export default SkyRiver;