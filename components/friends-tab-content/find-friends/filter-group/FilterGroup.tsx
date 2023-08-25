import React from 'react';
import style from './filter-group.module.css';
import CityFilter from './city-filter/CityFilter';
import FeaturedWeahterFilter from './featured-weather-filter/FeaturedWeahterFilter';
import {IoFilter} from 'react-icons/io5';
import { UserFilter, useFilter } from '../FilterContext';
import { useEffect } from 'react';
import {isEqual} from 'lodash';
interface FilterGroupProps {
    handleFilterSearch: (filter: UserFilter, lastCursor?: Date) => void;
    resetSort: () => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({handleFilterSearch, resetSort}) => {
    const {filter, filterBusy, ogFilter, setOgFilter} = useFilter();
    const [filterChanged, setFilterChanged] = React.useState(false);
    useEffect(() => {
        if(filter && !ogFilter){
            setOgFilter({...filter});
        } else if(filter){
            if(!isEqual(filter,ogFilter)){
                setFilterChanged(true);
            } else {
                setFilterChanged(false);
            }
        }
    }, [filter])
    return (
        <div className={style['filter-group']}>
            <h3 className="flex flex-row items-center text-xl font-bold "><IoFilter className="icon mr-2"/> Filter By</h3>
            <CityFilter/>
            <FeaturedWeahterFilter/>
            <button onClick={()=>{
                const currentDate = new Date();
                handleFilterSearch(filter, currentDate);
                setOgFilter({...filter});
                setFilterChanged(false);
                resetSort();
            }} className={`action-btn mt-8 ${filterBusy && style['busy']} ${!filterChanged && style['no-change']}`}>
                Apply Filter
            </button>
        </div>
    );
};

export default FilterGroup;