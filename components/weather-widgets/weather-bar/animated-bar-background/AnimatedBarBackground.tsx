import React from 'react';
import style from './animated-bar-background.module.css';

interface AnimatedBarBackgroundProps {

}

const AnimatedBarBackground: React.FC<AnimatedBarBackgroundProps> = ({}) => {
    return (
        <div className={style['animated-bar-background']}>
            AnimatedBarBackground
        </div>
    );
};

export default AnimatedBarBackground;