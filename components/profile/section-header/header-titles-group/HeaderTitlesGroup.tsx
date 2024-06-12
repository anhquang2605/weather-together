import React from 'react';
import style from './header-titles-group.module.css';

interface HeaderTitlesGroupProps {
    titles: string[]
}

const HeaderTitlesGroup: React.FC<HeaderTitlesGroupProps> = ({titles}) => {
    return (
        <div className={style['header-titles-group']}>
            HeaderTitlesGroup
        </div>
    );
};

export default HeaderTitlesGroup;