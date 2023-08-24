import React from 'react';
import style from './filter-group.module.css';
import CityFilter from './city-filter/CityFilter';
import FeaturedWeahterFilter from './featured-weather-filter/FeaturedWeahterFilter';
import {IoFilter} from 'react-icons/io5';
import { UserFilter, useFilter } from '../FilterContext';
import { useEffect } from 'react';
interface FilterGroupProps {
    handleFilterSearch: (filter: UserFilter) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({handleFilterSearch}) => {
    const {filter, filterBusy} = useFilter();
    return (
        <div className={style['filter-group']}>
            <h3 className="flex flex-row items-center text-xl font-bold "><IoFilter className="icon mr-2"/> Filter By</h3>
            <CityFilter/>
            <FeaturedWeahterFilter/>
            <button onClick={()=>{
                handleFilterSearch(filter);
            }} className={`action-btn mt-8 ${filterBusy && style['busy']}`}>
                Apply Filter
            </button>
        </div>
    );
};

export default FilterGroup;