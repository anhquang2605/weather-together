import React, { useEffect, useState } from 'react';
import style from './city-filter.module.css';
import {FaTreeCity} from 'react-icons/fa6';
import { useSession } from 'next-auth/react';
import CoolRadio, {CoolRadioOption} from '../../../../form/cool-radio/CoolRadio';
import { useFilter } from '../../FilterContext';
import { getCitiesFromLongLat } from '../../../../../libs/geodb';
import { set } from 'lodash';
interface CityFilterProps {

}
const CityFilter: React.FC<CityFilterProps> = ({}) => {
    const {setFilter, setFilterBusy} = useFilter();
    const {data: session} = useSession();
    const [option, setOption] = useState('all'); // ['all-city', 'nearby'
    const user = session?.user;
    const cityOptions: CoolRadioOption[] = [
        {
            label: 'All',
            value: 'all'
        },
        {
            label: 'Nearby '+ user?.location?.city ,
            value: 'nearby'
        }
    ]
    const handleChange = (value: string) => {
        setOption(value);
    }
    const handleGetNearbyCities = async () => {
        let cities = [];
        try{
            setFilterBusy(true);
            cities = await getCitiesFromLongLat(user?.location?.latitude ?? "", user?.location?.longitude ?? "",'100');
        } catch(error){
            console.log(error);
        } finally{
            setFilterBusy(false);
            return cities;
        }
        //handleFilterSet(filter, "nearbyCities", cities);
    }
    useEffect(() => {
        if(option === 'all'){
            setFilter((prev) => {
                return {
                    ...prev,
                    nearbyCities: []
                }
            })
        }
        else if(option === 'nearby'){
        
           handleGetNearbyCities().then((cities)=>{
                setFilter((prev) => {
                    return {
                        ...prev,
                        nearbyCities: cities
                    }
                })
           })
        }
    }, [option])
    return (
        <div className={style['city-filter']}>
            <h3><FaTreeCity/>City <span></span> </h3>
            <CoolRadio onChange={handleChange} options={cityOptions}/>
            
        </div>
    );
};

export default CityFilter;