import React from 'react';
import style from './background.module.css';

interface backgroundProps {
    weatherType: string;
}

const background: React.FC<backgroundProps> = ({weatherType}) => {
    return (
        <div className={`${style['background']} ${style[weatherType]} ${style['']}`}>
        </div>
    );
};

export default background;