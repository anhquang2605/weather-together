import React from 'react';
import style from './weather-status.module.css';
import { useWeatherBarContext } from '../useWeatherBarContext';

interface WeatherStatusProps {
    conditions: string;
    temp: number;
}

const WeatherStatus: React.FC<WeatherStatusProps> = ({conditions, temp}) => {
    const {isExpanded, variation} = useWeatherBarContext();
    return (
        <div className={`${style['weather-status']} ${!isExpanded ? style['shrunk'] : ""} ${style[variation]}`}>
             <span>
                {
                    Math.round(temp) + "°" 
                }
            </span>
            <span>
                {
                    conditions
                }
            </span>
           
        </div>
    );
};

export default WeatherStatus;