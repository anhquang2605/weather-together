import React from 'react';
import style from './control-option.module.css';

interface ControlOptionProps {

}

const ControlOption: React.FC<ControlOptionProps> = ({}) => {
    return (
        <div className={style['control-option']}>
            ControlOption
        </div>
    );
};

export default ControlOption;