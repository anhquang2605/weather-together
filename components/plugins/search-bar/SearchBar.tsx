import { ChangeEvent, useState } from 'react';
import style from './search-bar.module.css'
import {IoSearch} from 'react-icons/io5'
interface SearchBarProps {
    query: string;
    setQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}
export default function SearchBar(props: SearchBarProps) {
    const {query, setQuery, placeholder} = props;
    const [searchStarted, setSearchStarted] = useState(false);
    return (
        <div className={style['search-bar'] + " " + (searchStarted ? style["searching"] : "")}>
            <IoSearch className={"w-8 h-8"}/>
            <div className={style['search-input-container'] + " w-full"}>
                <div className={style['search-bar-background']}></div>
                <input value={query} onChange={setQuery}  type="text" className={style['search-input'] + " w-full"} placeholder={placeholder} onFocus={()=>{setSearchStarted(true)}} onBlur={()=>{setSearchStarted(false)}}/>
            </div>
        </div>
    )
}