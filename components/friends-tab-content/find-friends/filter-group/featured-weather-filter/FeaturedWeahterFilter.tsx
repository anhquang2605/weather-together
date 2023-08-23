import React from 'react';
import style from './featured-weather-filter.module.css';
import {TiWeatherPartlySunny} from 'react-icons/ti';
interface featuredWeatherFilterProps {

}

const featuredWeatherFilter: React.FC<featuredWeatherFilterProps> = ({}) => {
    return (
        <div className={style['featured-weather-filter']}>
            <h3> <TiWeatherPartlySunny/>Featured Weather</h3>
        </div>
    );
};

export default featuredWeatherFilter;