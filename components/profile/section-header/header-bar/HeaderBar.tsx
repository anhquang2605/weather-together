import React from 'react';
import style from './header-bar.module.css';

interface HeaderBarProps {

}

const HeaderBar: React.FC<HeaderBarProps> = ({}) => {
    return (
        <div className={style['header-bar']}>
            HeaderBar
        </div>
    );
};

export default HeaderBar;