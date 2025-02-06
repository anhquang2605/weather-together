import React from 'react';
import style from './weather-spinner.module.css';

interface WeatherSpinnerProps {

}

const WeatherSpinner: React.FC<WeatherSpinnerProps> = ({}) => {
    return (
        <div className={style['weather-spinner']}>
            WeatherSpinner
        </div>
    );
};

export default WeatherSpinner;