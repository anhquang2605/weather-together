import React from 'react';
import style from './engagement-background.module.css';
import ThemePlacer from './theme-placer/ThemePlacer';

interface EngagementBackgroundProps {

}

const EngagementBackground: React.FC<EngagementBackgroundProps> = ({}) => {
    return (
        <div className={style['engagement-background']}>
            <ThemePlacer themeOption={'default'} />
        </div>
    );
};

export default EngagementBackground;