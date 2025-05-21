import React, { useEffect, useState } from 'react';
import style from './featured-weather-filter.module.css';
import {TiWeatherPartlySunny} from 'react-icons/ti';
import {WEATHERS} from '../../../../../constants/weathers';
import WeatherIcon from '../../../../weather-widgets/pluggins/weather-icon/WeatherIcon';
import CheckBoxGroup from '../../../../form/check-box-group/CheckBoxGroup';
import { useFilter } from '../../FilterContext';
interface featuredWeatherFilterProps {

}

const FeaturedWeatherFilter: React.FC<featuredWeatherFilterProps> = ({}) => {
    const {setFilter} = useFilter();
    const [checkedOptions, setCheckedOptions] = useState<string[]>([]);
    const options = WEATHERS.map((weather, index) => {
        return weather.name;
    })
    const optionLabelRender = (label: string) => {
        return(
            <WeatherIcon weatherName={label}/>
        )
    }
    useEffect(() => {
        setFilter(prevState => {
            const newState = {...prevState};
            newState.featuredWeathers = checkedOptions;
            return newState;
        })
    }, [checkedOptions]);
    return (
        <div className={style['featured-weather-filter']}>
            <h3> <TiWeatherPartlySunny/>Featured Weather <span></span></h3>
            <CheckBoxGroup initialOptions={options} optionLabelRender={optionLabelRender} handleCheckedOptions={setCheckedOptions}/>
        </div>
    );
};

export default FeaturedWeatherFilter;