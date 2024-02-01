import React from 'react';
import style from './animated-bar-background.module.css';
import Background from './background/Background';

interface AnimatedBarBackgroundProps {
    weatherType: string;
}

const AnimatedBarBackground: React.FC<AnimatedBarBackgroundProps> = ({weatherType}) => {
    return (
        <div className={style['animated-bar-background']}>
            {
                //weatherType.replace('-', ' ')
            }
            <Background weatherType={weatherType} /> 
        </div>
    );
};

export default AnimatedBarBackground;