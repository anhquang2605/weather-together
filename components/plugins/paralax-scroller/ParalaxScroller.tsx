import React from 'react';
import style from './paralax-scroller.module.css';

interface ParalaxScrollerProps {
    children: React.ReactNode;
    secctionIds?: string[];
    scrollSpeed?: number;
    snapToSections?: boolean;
}

const ParalaxScroller: React.FC<ParalaxScrollerProps> = (props) => {
    const { children } = props;
    return (
        <div className={style['paralax-scroller']}>
            {
                children
            }
        </div>
    );
};

export default ParalaxScroller;