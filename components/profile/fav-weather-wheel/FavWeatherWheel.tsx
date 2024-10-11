import React from 'react';
import style from './fav-weahther-wheel.module.css';

interface FavWeatherWheelProps {

}
/**
 * This component is used to display the favorites weathers options when they want to edit their favorite weathers
 */
const FavWeatherWheel: React.FC<FavWeatherWheelProps> = ({}) => {
    return (
        <div className={style['fav-weather-wheel']}>
            FavWeatherWheel
        </div>
    );
};

export default FavWeatherWheel;