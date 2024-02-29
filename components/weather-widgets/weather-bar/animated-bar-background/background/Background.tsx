import React from 'react';
import style from './background.module.css';
import MovingClouds from './animated-components/moving-clouds/MovingClouds';
import SkyRiver from './animated-components/sky-river/SkyRiver';
import HappyMoon from './animated-components/happy-moon/HappyMoon';

interface backgroundProps {
    weatherType: string;
}

const background: React.FC<backgroundProps> = ({weatherType}) => {
    return (
        <div className={`${style['background']} ${style[weatherType]} ${style['night']}`}>
                        <HappyMoon />
            <SkyRiver noOfLane={3} />

        </div>
    );
};

export default background;