import React from 'react';
import style from './paralax-section.module.scss';

interface ParalaxSectionProps {
    id: string;
    className: string;
    children: React.ReactNode;
}

 interface IPalaxSection {
    id: string;
    content: string;
    reaction?: () => void;
}

const ParalaxSection: React.FC<ParalaxSectionProps> = ({children, id, className}) => {
    return (
        <div id={id} className={style['paralax-section'] + " h-[3000px] " + className}>
            {children}
        </div>
    );
};

export default ParalaxSection;