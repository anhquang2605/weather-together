import React from 'react';
import style from './date-info.module.css';

interface DateInfoProps {

}

const DateInfo: React.FC<DateInfoProps> = ({}) => {
    return (
        <div className={style['date-info']}>
            DateInfo
        </div>
    );
};

export default DateInfo;