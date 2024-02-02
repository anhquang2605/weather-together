import React from 'react';
import style from './background.module.css';
import MovingClouds from './animated-components/moving-clouds/MovingClouds';

interface backgroundProps {
    weatherType: string;
}

const background: React.FC<backgroundProps> = ({weatherType}) => {
    return (
        <div className={`${style['background']} ${style[weatherType]} ${style['night']}`}>
            <MovingClouds/>
        </div>
    );
};

export default background;