import React, { useState } from 'react';
import style from './date-info.module.css';
import { format } from 'date-fns';
import { useWeatherBarContext } from '../useWeatherBarContext';
interface DateInfoProps {
    dateStr: string;
}

const DateInfo: React.FC<DateInfoProps> = ({dateStr}) => {
    const dayInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const {isExpanded} = useWeatherBarContext();
    const [date,setDate] = useState(new Date(dateStr));
    return (
        <div className={style['date-info'] + (!isExpanded ? style["shrunk"] : "")}>
            <span className={style['day-in-week']}>
                {
                    dayInWeek[date.getDay()]
                }
            </span>
            <span className={style['date']}>
                {
                    format(date, "MM / dd")
                }
            </span>
        </div>
    );
};

export default DateInfo;