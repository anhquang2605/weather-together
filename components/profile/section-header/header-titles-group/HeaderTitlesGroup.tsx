import React from 'react';
import style from './header-titles-group.module.css';

interface HeaderTitlesGroupProps {
    titles: string[];
    currentIndex?: number;
}
//HELPERS
const transformTitle = (title: string) => {
    return title.charAt(0).toUpperCase() + title.slice(1);
}
const HeaderTitlesGroup: React.FC<HeaderTitlesGroupProps> = ({titles, currentIndex = 0}) => {
    return (
        <div className={style['header-titles-group']}>
            {transformTitle(titles[currentIndex])}
        </div>
    );
};

export default HeaderTitlesGroup;