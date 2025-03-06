import React, { useEffect } from 'react';
import style from './weather-spinner.module.css';
import anime from 'animejs';
import Sunny from './animations/sunny/Sunny';

interface WeatherSpinnerProps {

}

const WeatherSpinner: React.FC<WeatherSpinnerProps> = ({}) => {
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
            <Sunny />
        </div>
    );
};

export default WeatherSpinner;