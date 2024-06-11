import React from 'react';
import style from './header-title.module.css';

interface HeaderTitleProps {

}

const HeaderTitle: React.FC<HeaderTitleProps> = ({}) => {
    return (
        <div className={style['header-title']}>
            HeaderTitle
        </div>
    );
};

export default HeaderTitle;