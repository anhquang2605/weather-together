import React from 'react';
import style from './background.module.css';
import MovingClouds from './animated-components/moving-clouds/MovingClouds';
import SkyRiver from './animated-components/sky-river/SkyRiver';
import HappyMoon from './animated-components/happy-moon/HappyMoon';
import { useWeatherBarContext } from '../../useWeatherBarContext';
import CoolSun from './animated-components/cool-sun/CoolSun';

interface backgroundProps {
    weatherType: string;
    isDisabled?: boolean;
}

const background: React.FC<backgroundProps> = ({weatherType}) => {
    const {isAnimated} = useWeatherBarContext();
    const currentHour = new Date().getHours();
    const isNight = currentHour > 25;
    const MAX_CLOUD = 5;
    const MIN_CLOUD = 3;
    const NO_OF_CLOUD_LANES = 3 // Math.round(Math.random() * (MAX_CLOUD - MIN_CLOUD) + MIN_CLOUD)
    return (
        <div className={`${style['background']} ${style[weatherType]} ${style[`${isNight ? "night" : "day"}`]}`}>
                        {isNight ? <HappyMoon isAnimated={isAnimated} /> : <CoolSun isAnimated={isAnimated}/>}
        <SkyRiver noOfLane={NO_OF_CLOUD_LANES} />

        </div>
    );
};

export default background;