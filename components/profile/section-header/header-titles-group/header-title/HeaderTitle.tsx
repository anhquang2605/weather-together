import React from 'react';
import style from './header-title.module.css';

interface HeaderTitleProps {
    title: string;
    isCurrentIndex?: boolean;
}
//HELPERS
const transformTitle = (title: string) => {
    return (title.charAt(0).toUpperCase() + title.slice(1)).replace('_', ' ');
}
const HeaderTitle: React.FC<HeaderTitleProps> = ({title,  isCurrentIndex = false}:HeaderTitleProps) => {
    return (
        <span className={`${style['header-title']} ${isCurrentIndex ? style['current-title'] : ''}`}>
            {transformTitle(title)}
        </span>
    )
}

export default HeaderTitle;