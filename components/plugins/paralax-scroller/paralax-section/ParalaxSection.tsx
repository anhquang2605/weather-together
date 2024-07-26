import React from 'react';
import style from './paralax-section.module.scss';

interface ParalaxSectionProps {
    id: string;
    className: string;
    children: React.ReactNode;
    withHeadFiller?: boolean; //to scroll back up, simulate the end but reversed
}

 interface IPalaxSection {
    id: string;
    content: string;
    reaction?: () => void;
}

const ParalaxSection: React.FC<ParalaxSectionProps> = ({children, id, className , withHeadFiller}) => {
    return (
        <div id={id} className={style['paralax-section'] + " h-[3000px] " + className + ( id === 'end' ? " " + style['end'] : "") }>
            {withHeadFiller && <div className={style['head']} id={id + '-head'}/>}
            {children}
        </div>
    );
};

export default ParalaxSection;