import React, { useEffect } from 'react';
import style from './weather-spinner.module.css';
import anime from 'animejs';
import Cloudy from './animations/cloudy/Cloudy';

interface WeatherSpinnerProps {
    startUpdate?: boolean;
}

const WeatherSpinner: React.FC<WeatherSpinnerProps> = ({startUpdate}) => {
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

    },[])
    return (
        <div className={style['weather-spinner']}>
            <Cloudy toStart={startUpdate}/>
        </div>
    );
};

export default WeatherSpinner;