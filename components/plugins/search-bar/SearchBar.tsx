import { ChangeEvent, useEffect, useState } from 'react';
import style from './search-bar.module.css'
import {IoSearch} from 'react-icons/io5'
import React from 'react';
interface SearchBarProps {
    query: string;
    setQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    onSearch: (event: React.MouseEvent<HTMLButtonElement>|React.KeyboardEvent<HTMLInputElement>) => void;
    variant?: "default" | "bordered";
    autoCompleteSearch?: boolean;
}
export default function SearchBar(props: SearchBarProps) {
    const {query, setQuery, placeholder, onSearch, variant, autoCompleteSearch} = props;
    const [searchStarted, setSearchStarted] = useState(false);
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === "Enter"){
            onSearch(event);
        }
    }
    
    return (
        <div className={style['search-bar'] + " " + style[variant || ''] + " " + (searchStarted ? style["searching"] : "")}>
            <div className={style['search-input-container'] + " w-full"}>
                {
                    autoCompleteSearch && 
                    <div className={"p-2 " + style["autocomplete-icon"]}>
                        <IoSearch className={`icon`}/>
                    </div>

                }
                {variant === 'default' && <div className={style['search-bar-background']}></div>}
                <input onKeyDown={handleKeyDown} value={query} onChange={setQuery}  type="text" className={style['search-input'] + " w-full"} placeholder={placeholder} onFocus={()=>{setSearchStarted(true)}} onBlur={()=>{setSearchStarted(false)}}/>
            </div>
            {!autoCompleteSearch && <button onClick={onSearch} className={style['search-button']}>
                <IoSearch className={`icon`}/>
            </button>}
        </div>
    )
}