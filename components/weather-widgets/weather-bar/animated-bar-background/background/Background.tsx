import React, { useEffect, useState } from 'react';
import style from './background.module.css';
import SkyRiver from './animated-components/sky-river/SkyRiver';
import HappyMoon from './animated-components/happy-moon/HappyMoon';
import { useWeatherBarContext } from '../../useWeatherBarContext';
import CoolSun from './animated-components/cool-sun/CoolSun';
interface backgroundProps {
    weatherType: string;
    isDisabled?: boolean;
}
const background: React.FC<backgroundProps> = ({weatherType}) => {
    const {isAnimated, isExpanded} = useWeatherBarContext();
    const [coreSVGClassname, setCoreSVGClassname] = useState("");
    const currentHour = new Date().getHours();
    const isNight = currentHour > 19;
    const NO_OF_CLOUD_LANES = 3 // Math.round(Math.random() * (MAX_CLOUD - MIN_CLOUD) + MIN_CLOUD)
    useEffect(()=>{
        if(isExpanded){
            setCoreSVGClassname(style["main-actor"]);
        }else{
            setCoreSVGClassname(style["main-actor-compact"]);
        }
    },[isExpanded])
    return (
        <div className={`${style['background']} ${style[weatherType]} ${style[`${isNight ? "night" : "day"}`]}`}>
                        {isNight ? <HappyMoon isAnimated={isAnimated} /> : <CoolSun extraClassName={coreSVGClassname} isAnimated={isAnimated}/>}
        <SkyRiver noOfLane={NO_OF_CLOUD_LANES} />
        </div>
    );
};
export default background;