import React from 'react';
import style from './weather-icon.module.css';
import { weatherToColorClassMap,weatherNameToIconAliasMap } from '../../../../constants/weathers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
interface WeatherIconProps {
    weatherName: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({weatherName}) => {
    return (
        <div title={weatherName} className={style['weather-icon']}>
            <FontAwesomeIcon className={weatherToColorClassMap[weatherName]} icon={['fas', (weatherNameToIconAliasMap[weatherName]) as any]}/>
        </div>
    );
};

export default WeatherIcon;