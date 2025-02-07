import React, { useEffect } from 'react';
import style from './weather-spinner.module.css';
import anime from 'animejs';

interface WeatherSpinnerProps {

}

const WeatherSpinner: React.FC<WeatherSpinnerProps> = ({}) => {
    const startAnimation = () => {
        const timeline = anime.timeline({});
    }
    useEffect(()=> {

    },[])
    return (
        <div className={style['weather-spinner']}>
            WeatherSpinner
        </div>
    );
};

export default WeatherSpinner;