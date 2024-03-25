import React from 'react';
import style from './background.module.css';
import MovingClouds from './animated-components/moving-clouds/MovingClouds';
import SkyRiver from './animated-components/sky-river/SkyRiver';
import HappyMoon from './animated-components/happy-moon/HappyMoon';
import { useWeatherBarContext } from '../../useWeatherBarContext';
import CoolSun from './animated-components/cool-sun/CoolSun';

interface backgroundProps {
    weatherType: string;
}

const background: React.FC<backgroundProps> = ({weatherType}) => {
    const {isHovered} = useWeatherBarContext();
    const currentHour = new Date().getHours();

    return (
        <div className={`${style['background']} ${style[weatherType]} ${style[`${currentHour > 18 ? "night" : "day"}`]}`}>
                        {currentHour > 18 ? <HappyMoon isAnimated={isHovered} /> : <CoolSun isAnimated={isHovered}/>}
        <SkyRiver noOfLane={3} />

        </div>
    );
};

export default background;