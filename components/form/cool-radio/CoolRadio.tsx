import React, { useState } from 'react';
import style from './cool-radio.module.css';
export interface CoolRadioOption{
    label: string;
    value: string;
}
interface CoolRadioProps {
    options: CoolRadioOption[];
    onChange: (value:string) => void;
}

const CoolRadio: React.FC<CoolRadioProps> = ({options, onChange}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    return (
        <div className={style['cool-radio']}>
            {
                options.map((option, index) => {
                    return (
                        <div onClick={()=>{
                            setSelectedIndex(index);
                            onChange(option.value)
                        }} key={option.value} className={`${style['option']} ${index === selectedIndex && style['selected']}`}>  
                            <span id={option.value} className={style['option-input']}>
                            </span>
                            <span className={style['label']}>{option.label}</span> 
                        </div>
                    )
                })
            }
        </div>
    );
};

export default CoolRadio;