import React from 'react';
import style from './fav-weather-wheel.module.css';
import WeatherIcon from '../../weather-widgets/pluggins/weather-icon/WeatherIcon';

interface FavWeatherWheelProps {
    weatherName: string;
    isEditable?: boolean;
    size: string;
}
/**
 * This component is used to display the favorites weathers options when they want to edit their favorite weathers
 */
const FavWeatherWheel: React.FC<FavWeatherWheelProps> = ({size, weatherName, isEditable}) => {
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
            <div className={style['featured-weather']}>
                    <WeatherIcon
                        weatherName={weatherName || ''}
                        size={ shortDimension(size)}
                    />
            </div>
        </div>
    );
};

export default FavWeatherWheel;