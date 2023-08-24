import React, { useState } from 'react';
import style from './featured-weather-filter.module.css';
import {TiWeatherPartlySunny} from 'react-icons/ti';
import {WEATHERS} from '../../../../../constants/weathers';
import WeatherIcon from '../../../../weather-widgets/pluggins/weather-icon/WeatherIcon';
import CheckBoxGroup from '../../../../form/check-box-group/CheckBoxGroup';
interface featuredWeatherFilterProps {

}

const featuredWeatherFilter: React.FC<featuredWeatherFilterProps> = ({}) => {
    const [checkedOptions, setCheckedOptions] = useState<string[]>([]);
    const options = WEATHERS.map((weather, index) => {
        return weather.name;
    })
    const optionLabelRender = (label: string) => {
        return(
            <WeatherIcon weatherName={label}/>
        )
    }
    return (
        <div className={style['featured-weather-filter']}>
            <h3> <TiWeatherPartlySunny/>Featured Weather</h3>
            <CheckBoxGroup initialOptions={options} optionLabelRender={optionLabelRender} handleCheckedOptions={setCheckedOptions}/>
        </div>
    );
};

export default featuredWeatherFilter;