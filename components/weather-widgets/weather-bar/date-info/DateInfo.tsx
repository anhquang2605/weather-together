import React from 'react';
import style from './date-info.module.css';
import { format } from 'date-fns';
interface DateInfoProps {
    dateStr: string;
}

const DateInfo: React.FC<DateInfoProps> = ({dateStr}) => {
    return (
        <div className={style['date-info']}>
            {
                
            }
        </div>
    );
};

export default DateInfo;