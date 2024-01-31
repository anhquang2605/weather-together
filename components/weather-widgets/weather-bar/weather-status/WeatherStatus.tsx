import React from 'react';
import style from './weather-status.module.css';

interface WeatherStatusProps {
    conditions: string;
    temp: number;
}

const WeatherStatus: React.FC<WeatherStatusProps> = ({conditions, temp}) => {
    return (
        <div className={style['weather-status']}>
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