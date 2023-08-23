import React, { use, useEffect, useState } from 'react';
import style from './suggestion-drop-down.module.css';
import { set } from 'lodash';

interface SuggestionDropDownProps<T> {
    suggestions: T[];
    suggestionRenderer: (suggestion: T, index: number) => JSX.Element;
    searchStarted: boolean;
}

const SuggestionDropDown = <T,> ({suggestions, suggestionRenderer, searchStarted}:SuggestionDropDownProps<T>) => {
    const [reveal, setReveal] = useState(false);
    const handleOutsideClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if(!target.closest(`.${style['suggestion-drop-down']}`)){
            setReveal(false);
        }
    }
    useEffect(()=>{

        document.addEventListener('click', (event) => {
            handleOutsideClick(event);
        });

        return () => {
            document.removeEventListener('click', (event) => {
               handleOutsideClick(event);
            });
        }
    },[])
    useEffect(() => {
        if(suggestions.length > 0){
            setReveal(true);
        }else{
            setReveal(false);
        }
       
    }, [suggestions])
    return (
        <div className={`${style['suggestion-drop-down']} ${reveal ? style.reveal : ""} `}>
            {suggestions.map((suggestion, index) => {
                return (
                    suggestionRenderer(suggestion, index)
                )
                })
            }
        </div>
    );
};

export default SuggestionDropDown;