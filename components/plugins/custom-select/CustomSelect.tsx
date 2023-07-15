import { use, useEffect, useRef, useState } from 'react';
import style from './custom-select.module.css'
interface Option{
    value: string;
    description: string;
}
interface CustomSelectProps {
    options: Option[];
    selectedId: number;
    setSelected: (id:number) => void;
    optionTemplate?: (title:string, description:string, selectedOption:boolean) => JSX.Element;
    optionClassName?: string; //for styling the options with class or tailwind
    dropDownClassName?: string; //for styling the drop down with class or tailwind
    selectedOptionClassName?: string; //for styling the selected option with class or tailwind
    selectBarClassName?: string; //for styling the select bar with class or tailwind
}
/*
CUSOM SELECT COMPONENT

dependencies: tailwindcss, nextjs

language: typescript

author: Anh Quang Chu

date: 2021-08-10

description:
- This custom select allow user to select from a list (Array) of Options
- The selected option is determined by the selectedId prop (which represent the position of the option in the array)
- The setSelected prop is a function that will be called when the user select an option which will update the selectedId prop in the parent component, this is important for form handling
- The template prop is a function that will be called for each option to render the option jsx, it takes 3 parameters:
    * title: the title of the option
    * description: the description of the option
    * selectedOption: a boolean that indicate if the option is the selected option or not
- For styling, the component has 4 class names that can be used to style the component:
    * optionClassName: for styling the options with class or tailwind
    * dropDownClassName: for styling the drop down with class or tailwind
    * selectedOptionClassName: for styling the selected option with class or tailwind
    * selectBarClassName: for styling the select bar with class or tailwind

*/
export default function CustomSelect({options, selectedId, setSelected, optionTemplate, optionClassName, dropDownClassName, selectedOptionClassName}: CustomSelectProps) {
    const [isDropped, setIsDropped] = useState<boolean>(false);
    const customSelectRef = useRef<HTMLDivElement | null>(null)
    const optionsJSX = 
        options.map((option, index) => {
            return (
                <div
                    key={option.value}
                    className={
                        style['select-option'] + " "  +
                        (selectedId == index ? (selectedOptionClassName + " " + style["selected"]) : "")
                        
                    } 
                    
                    onClick={()=>{
                        setSelected(index)
                    }}
                    
                    >
                    
                    {optionTemplate ?
                        optionTemplate(option.value, option.description, false)
                        :
                        <div key={option.value} data-value={option.value}>
                            {option.value + "-" + option.description}
                        </div>}
                </div>
            )
        })
    const selectedOptionJSX = (
        optionTemplate ?
            optionTemplate(options[selectedId].value, options[selectedId].description, true)
        :
            <div className={style["select-option"] + " " + (optionClassName ? optionClassName : "")} key={options[selectedId].value} data-value={options[selectedId].value}>
                {options[selectedId].value}
            </div>
    )
    const handleClickOutside = (e:MouseEvent) => {
        if(customSelectRef.current && !customSelectRef.current.contains(e.target as Node)){
            setIsDropped(false);
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [])
    useEffect(() => {
        setIsDropped(false);
    }, [selectedId]) 
    return(
        <div ref={customSelectRef} key="unique" className={style["custom-select"]}>
            <div onClick={()=>{setIsDropped(true)}} className={style["selected-option"] + (optionClassName ? " " + optionClassName : "") + " " + selectedOptionClassName}>
                {selectedOptionJSX}
            </div>
            <div 
                className={
                    style["drop-down"] + " " 
                    + (dropDownClassName ?? "") + "" 
                    + (isDropped ? style["selections-dropped"] : " ")}>
                {
                    optionsJSX
                }
            </div>

        </div>
    )
}