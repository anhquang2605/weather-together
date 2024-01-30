import React from 'react';
import style from './weather-bar.module.css';
import DateInfo from './date-info/DateInfo';
import WeatherStatus from './weather-status/WeatherStatus';
import AnimatedBarBackground from './animated-bar-background/AnimatedBarBackground';
import { CurrentConditions } from '../../../types/WeatherData';

interface WeatherBarProps {
    currentCondition: CurrentConditions
}

const WeatherBar: React.FC<WeatherBarProps> = ({currentCondition}) => {
    
    return (
        <div className={style['weather-bar']}>
            <DateInfo/>
            <WeatherStatus/>
            <AnimatedBarBackground/>
        </div>
    );
};

export default WeatherBar;