import React from 'react';
import style from './paralax-section.module.scss';

interface ParalaxSectionProps {
    id: string;
    className: string;
    children: React.ReactNode;
}

const ParalaxSection: React.FC<ParalaxSectionProps> = ({children, id, className}) => {
    return (
        <div id={id} className={style['paralax-section'] + " " + className}>
            {children}
        </div>
    );
};

export default ParalaxSection;