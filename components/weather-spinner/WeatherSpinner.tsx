import React, { useEffect, useState } from 'react';
import style from './weather-spinner.module.css';
import anime from 'animejs';
import Cloudy from './animations/cloudy/Cloudy';

interface WeatherSpinnerProps {
    startUpdate?: boolean;
}

const WeatherSpinner: React.FC<WeatherSpinnerProps> = ({startUpdate = false}) => {
    const [startRain, setStartRain] = useState(false);
    const [startWind, setStartWind] = useState(false);
    const [startSun, setStartSun] = useState(false);
    const startAnimation = () => {
        const timeline = anime.timeline({});
    }
    const sunnyAnimation = () => {
        
    }
    const cloudyAnimation = () => {
        
    }
    const windyAnimation = () => {
        
    }
    useEffect(()=> {
        setStartRain(startUpdate );
    },[])
    return (
        <div className={style['weather-spinner']}>
            <Cloudy toStart={startUpdate}/>
        </div>
    );
};

export default WeatherSpinner;