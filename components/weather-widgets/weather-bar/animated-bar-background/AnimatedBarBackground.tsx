import React from 'react';
import style from './animated-bar-background.module.css';

interface AnimatedBarBackgroundProps {
    weatherType: string;
}

const AnimatedBarBackground: React.FC<AnimatedBarBackgroundProps> = ({weatherType}) => {
    return (
        <div className={style['animated-bar-background']}>
            {
                weatherType.replace('-', ' ')
            }
        </div>
    );
};

export default AnimatedBarBackground;