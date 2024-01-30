import React from 'react';
import style from './weather-status.module.css';

interface WeatherStatusProps {

}

const WeatherStatus: React.FC<WeatherStatusProps> = ({}) => {
    return (
        <div className={style['weather-status']}>
            WeatherStatus
        </div>
    );
};

export default WeatherStatus;