import React from 'react';
import style from './engagement-background.module.css';

interface EngagementBackgroundProps {

}

const EngagementBackground: React.FC<EngagementBackgroundProps> = ({}) => {
    return (
        <div className={style['engagement-background']}>
            EngagementBackground
        </div>
    );
};

export default EngagementBackground;