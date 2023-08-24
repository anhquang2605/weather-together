import React from 'react';
import style from './filter-group.module.css';
import CityFilter from './city-filter/CityFilter';
import FeaturedWeahterFilter from './featured-weather-filter/FeaturedWeahterFilter';
import {IoFilter} from 'react-icons/io5';
interface FilterGroupProps {
    
}

const FilterGroup: React.FC<FilterGroupProps> = ({}) => {
    return (
        <div className={style['filter-group']}>
            <h3 className="flex flex-row items-center text-lg font-bold "><IoFilter className="icon mr-2"/> Filter By</h3>
            <CityFilter/>
            <FeaturedWeahterFilter/>
            <button className="action-btn mt-8">
                Apply Filter
            </button>
        </div>
    );
};

export default FilterGroup;