import React from 'react';
import style from './weather-icon.module.css';
import { weatherToColorClassMap,weatherNameToIconAliasMap } from '../../../../constants/weathers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
interface WeatherIconProps {
    weatherName: string;
    size?: string; //lg, md, sm
}

const WeatherIcon: React.FC<WeatherIconProps> = ({weatherName, size}) => {
    return (
        <div title={weatherName} className={style['weather-icon']}>
            <FontAwesomeIcon className={weatherToColorClassMap[weatherName]}  size={ (size || 'sm') as SizeProp} icon={['fas', (weatherNameToIconAliasMap[weatherName]) as any]}/>
        </div>
    );
};

export default WeatherIcon;