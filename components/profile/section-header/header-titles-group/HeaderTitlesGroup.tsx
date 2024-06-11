import React from 'react';
import style from './header-titles-group.module.css';

interface HeaderTitlesGroupProps {

}

const HeaderTitlesGroup: React.FC<HeaderTitlesGroupProps> = ({}) => {
    return (
        <div className={style['header-titles-group']}>
            HeaderTitlesGroup
        </div>
    );
};

export default HeaderTitlesGroup;