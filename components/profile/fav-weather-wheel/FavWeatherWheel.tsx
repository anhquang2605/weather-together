import React, { useState } from 'react';
import style from './fav-weather-wheel.module.css';
import WeatherIcon from '../../weather-widgets/pluggins/weather-icon/WeatherIcon';
import {WEATHERS} from '../../../constants/weathers';
interface FavWeatherWheelProps {
    weatherName: string;
    isEditable?: boolean;
    size: string;
}
/**
 * This component is used to display the favorites weathers options when they want to edit their favorite weathers
 */
const FavWeatherWheel: React.FC<FavWeatherWheelProps> = ({size, weatherName, isEditable}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const shortDimension = (size:string) => {
        switch(size){
            case 'two-x-large':
                return 'xl';
            case 'extra-large':
                return 'lg';
            case 'large':
                return 'md';
            case 'medium':
                return 'sm';
            case 'small':
                return 'sm';
            default:
                return 'md';
        }
    }
    return (
        <div className={style['fav-weather-wheel']}>
            {
                !isExpanded ? (
                    <div className={style['featured-weather']}>
                    <WeatherIcon
                        weatherName={weatherName || ''}
                        size={ shortDimension(size)}
                    />
                    </div>
                ) : (
                    <div className={style['weather-options']}>
                {WEATHERS.map((weather) => (
                    <div
                        className={style['weather-option']}
                        key={weather.name}
                    >
                        <WeatherIcon
                            weatherName={weather.name}
                            size={shortDimension(size)}
                        />
                    </div>
                ))}
            </div>
                )
            }
            
            
        </div>
    );
};

export default FavWeatherWheel;