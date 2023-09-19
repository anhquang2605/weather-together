import React from 'react';
import style from './slide.module.css';

interface SlideProps {
    children: React.ReactNode;
    active?: boolean;
    slideAnimation?: 'slide' | 'fade';
    index: number;
}

const Slide: React.FC<SlideProps> = ({children,active, index, slideAnimation = 'slide'}) => {
    return (
        <div key={index} className={style['slide'] + " " + (active? style['active-' + slideAnimation] : "")}>
            {children}
        </div>
    );
};

export default Slide;