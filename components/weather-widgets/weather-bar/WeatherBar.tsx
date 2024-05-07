import React, { useEffect, useRef, useState } from 'react';
import style from './weather-bar.module.css';
import DateInfo from './date-info/DateInfo';
import WeatherStatus from './weather-status/WeatherStatus';
import AnimatedBarBackground from './animated-bar-background/AnimatedBarBackground';
import { useWeatherContext } from '../../../pages/weatherContext';
import LoadingBox from '../../skeletons/loading-box/LoadingBox';
import { useWeatherBarContext } from './useWeatherBarContext';

interface WeatherBarProps {
    isExpanded: boolean;
}

const WeatherBar: React.FC<WeatherBarProps> = ({isExpanded}) => {
    const {todayWeather} = useWeatherContext();
    const {setIsHovered, setIsExpanded} = useWeatherBarContext();
    const ref = useRef<HTMLDivElement|null>(null);
    const handleMouseEnter = (event: MouseEvent) => {
        setIsHovered(true);
    } 
    const handleMouseLeave = (event: MouseEvent) => {
        setIsHovered(false);
    }
    useEffect(()=>{
        if(ref.current){
            ref.current.addEventListener('mouseenter',handleMouseEnter);
            ref.current.addEventListener('mouseleave',handleMouseLeave)
        }
        return () => {
            ref.current?.removeEventListener('mouseenter',handleMouseEnter);
            ref.current?.removeEventListener('mouseleave',handleMouseLeave);
        }
    },[])
    useEffect(()=>{
        setIsExpanded(isExpanded);
    },[isExpanded])
    return (
        <div ref = {ref} title="View today's Weather" className={style['weather-bar'] + " " + (!isExpanded ? style['shrunk'] : "")}>
            {
                todayWeather ?
                <>
                    <AnimatedBarBackground weatherType={todayWeather?.conditions ?? ""}/>
                     <DateInfo dateStr={todayWeather?.datetimeStr ?? ""}/>
                    <WeatherStatus temp={todayWeather.temp ?? 0} conditions={todayWeather.conditions} />
                    
                </>
                : 
                <LoadingBox />

            }
           
        </div>
    );
};

export default WeatherBar;