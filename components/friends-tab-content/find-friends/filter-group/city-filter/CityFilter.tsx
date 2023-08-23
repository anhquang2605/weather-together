import React from 'react';
import style from './city-filter.module.css';
import {FaTreeCity} from 'react-icons/fa6';
interface CityFilterProps {

}

const CityFilter: React.FC<CityFilterProps> = ({}) => {
    return (
        <div className={style['city-filter']}>
            <h3><FaTreeCity/>City </h3>
        </div>
    );
};

export default CityFilter;