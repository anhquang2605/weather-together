import React from 'react';
import style from './header-titles-group.module.css';

interface HeaderTitlesGroupProps {
    titles: string[];
    currentIndex?: number;
}
interface HeaderTitleProps {
    title: string;
}
//HELPERS
const transformTitle = (title: string) => {
    return (title.charAt(0).toUpperCase() + title.slice(1)).replace('_', ' ');
}
const HeaderTitle: React.FC<HeaderTitleProps> = ({title}:HeaderTitleProps) => {
    return (
        <span className={style['header-title']}>
            {transformTitle(title)}
        </span>
    )
}
const HeaderTitlesGroup: React.FC<HeaderTitlesGroupProps> = ({titles, currentIndex = 0}) => {
    return (
        <div className={style['header-titles-group']}>
            {titles.map((title, index) => (
                <HeaderTitle key={index} title={title} />
            ))}
        </div>
    );
};

export default HeaderTitlesGroup;