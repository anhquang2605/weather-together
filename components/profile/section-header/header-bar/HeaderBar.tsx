import React from 'react';
import style from './header-bar.module.css';

interface HeaderBarProps {
    currentIndex: number;
}

const HeaderBar: React.FC<HeaderBarProps> = ({}) => {
    return (
        <div className={style['header-bar']}>
            
        </div>
    );
};

export default HeaderBar;