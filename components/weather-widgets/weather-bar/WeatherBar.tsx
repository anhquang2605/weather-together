import React, { useEffect, useState } from 'react';
import style from './weather-bar.module.css';
import DateInfo from './date-info/DateInfo';
import WeatherStatus from './weather-status/WeatherStatus';
import AnimatedBarBackground from './animated-bar-background/AnimatedBarBackground';
import { CurrentConditions } from '../../../types/WeatherData';
import { useWeatherContext } from '../../../pages/weatherContext';

interface WeatherBarProps {

}

const WeatherBar: React.FC<WeatherBarProps> = ({}) => {
    const [isExpanded, setIsExpanded] =useState(false);
    const {todayWeather} = useWeatherContext();
    useEffect(() => {
        if(todayWeather){
            console.log(todayWeather);
        }
    }, [todayWeather]);
    return (
        <div className={style['weather-bar']}>
            <DateInfo/>
            <WeatherStatus/>
            <AnimatedBarBackground/>
        </div>
    );
};

export default WeatherBar;