import React from 'react';
import style from './featured-weather-badge.module.css';
import {IoHeart} from 'react-icons/io5'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';
interface weathersMap {
    [key: string]: string;
}

let weatherToClassMap:weathersMap = {
    "sunny": "text-orange-400",
    "cloudy": "text-sky-400" ,
    "rainy": "text-indigo-400" ,
    "snowy": "text-blue-400",
    "thunder": "text-yellow-400" ,
    "windy": "text-green-400" ,
}
let weatherNameToIconAliasMap:weathersMap = {
    "sunny": "sun",
    "cloudy": "cloud" ,
    "rainy": "cloud-rain" ,
    "snowy": "snowflake",
    "thunder": "bolt" ,
    "windy": "wind" ,
}
interface FeaturedWeatherBadgeProps {
    styleClass?: string;
    weatherName: string;
}

const FeaturedWeatherBadge: React.FC<FeaturedWeatherBadgeProps> = ({weatherName}) => {
    const colorsClass = weatherToClassMap[weatherName]
    return (
        <div className={style['featured-weather-badge']}>
            <IoHeart className="text-red-300 w-6 h-6"/>
            
            <div className={`absolute ${style['featured-icon']} w-[1px] h-[1px]`}>
                <FontAwesomeIcon  className={colorsClass}  icon={['fas', weatherNameToIconAliasMap[weatherName] as IconName]}/>
            </div>
           
        </div>
    );
};

export default FeaturedWeatherBadge;