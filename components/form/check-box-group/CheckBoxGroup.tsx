import React, { ReactNode, useEffect, useState } from 'react';
import style from './check-box-group.module.css';
import CheckBox from '../check-box/CheckBox';

export type CheckBoxOption = {
    [label: string]: boolean;
}

interface CheckBoxGroupProps {
    initialOptions: string[];
    optionLabelRender?: (label: string) => ReactNode;
    handleCheckedOptions: (options: string[]) => void;
}

const CheckBoxGroup: React.FC<CheckBoxGroupProps> = ({initialOptions, optionLabelRender, handleCheckedOptions}) => {
    const [checkedOptions, setCheckedOptions] = useState<CheckBoxOption>({});
    const [optionsSet, setOptionsSet] = useState<Set<string>>(new Set());
    const [checkBoxes, setCheckBoxes] = useState<ReactNode[]>([]);
    const handleChecked = (value: boolean, label: string) => {
        if(value){
            optionsSet.add(label);
        }else{
            optionsSet.delete(label);
        }
        setCheckedOptions(
            prevState => {
                const newState = {...prevState};
                newState[label] = value;
                return newState;
            }
        )
    }
    //const handleGenerateCheckBox = (options: string[] => )
    useEffect(()=>{
        if(initialOptions.length > 0){
            let checkBoxesMap: CheckBoxOption = {};
            let JSXarr: ReactNode[] = [];
            let len = initialOptions.length;
            for(let i = 0; i < len; i++){
                const label = initialOptions[i];
                checkBoxesMap[label] = false;
                JSXarr.push(<CheckBox key={i} label={label} labelJSX={optionLabelRender ?optionLabelRender(label) : null} returnLabel={true} handleChecked={handleChecked}/>)
            }
            setCheckBoxes(JSXarr);
            setCheckedOptions(checkBoxesMap);
        }
    },[])
    useEffect(()=>{
        handleCheckedOptions(Array.from(optionsSet));
    },[optionsSet])
    return (
        <div className={style['check-box-group']}>
            {checkBoxes}
        </div>
    );
};

export default CheckBoxGroup;