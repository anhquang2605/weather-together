import React, { useEffect, useState } from 'react';
import style from './weather-bar.module.css';
import DateInfo from './date-info/DateInfo';
import WeatherStatus from './weather-status/WeatherStatus';
import AnimatedBarBackground from './animated-bar-background/AnimatedBarBackground';
import { CurrentConditions } from '../../../types/WeatherData';
import { useWeatherContext } from '../../../pages/weatherContext';
import LoadingBox from '../../skeletons/loading-box/LoadingBox';

interface WeatherBarProps {

}

const WeatherBar: React.FC<WeatherBarProps> = ({}) => {
    const [isExpanded, setIsExpanded] =useState(false);
    const {todayWeather} = useWeatherContext();
   
    return (
        <div className={style['weather-bar']}>
            {
                todayWeather ?
                <>
                     <DateInfo dateStr={todayWeather?.datetimeStr ?? ""}/>
                    <WeatherStatus temp={todayWeather.temp ?? 0} conditions={todayWeather.conditions} />
                    <AnimatedBarBackground weatherType={todayWeather?.conditions ?? ""}/>
                </>
                : 
                <LoadingBox />

            }
           
        </div>
    );
};

export default WeatherBar;