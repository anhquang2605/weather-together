import React from 'react';
import style from './weather-status.module.css';
import { useWeatherBarContext } from '../useWeatherBarContext';

interface WeatherStatusProps {
    conditions: string;
    temp: number;
}

const WeatherStatus: React.FC<WeatherStatusProps> = ({conditions, temp}) => {
    const {isExpanded} = useWeatherBarContext();
    return (
        <div className={`${style['weather-status']} ${!isExpanded ? style['shrunk'] : ""}`}>
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