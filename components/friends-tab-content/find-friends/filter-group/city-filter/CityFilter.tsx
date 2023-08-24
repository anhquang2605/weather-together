import React, { useState } from 'react';
import style from './city-filter.module.css';
import {FaTreeCity} from 'react-icons/fa6';
import { useSession } from 'next-auth/react';
import CoolRadio, {CoolRadioOption} from '../../../../form/cool-radio/CoolRadio';
interface CityFilterProps {

}
const CityFilter: React.FC<CityFilterProps> = ({}) => {
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
    return (
        <div className={style['city-filter']}>
            <h3 className="font-bold"><FaTreeCity/>City </h3>
            <CoolRadio onChange={handleChange} options={cityOptions}/>
            
        </div>
    );
};

export default CityFilter;