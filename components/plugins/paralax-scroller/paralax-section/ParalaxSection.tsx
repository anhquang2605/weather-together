import React, { useEffect } from 'react';
import style from './paralax-section.module.scss';

interface ParalaxSectionProps {
    id: string;
    className: string;
    children: React.ReactNode;
    withHeadFiller?: boolean; //to scroll back up, simulate the end but reversed
    index: number;
}

 interface IPalaxSection {
    id: string;
    content: string;
    reaction?: () => void;
    
}

const ParalaxSection: React.FC<ParalaxSectionProps> = ({children, id, className , withHeadFiller, index}) => {
    const setFirstHiddenHeaderPosition = () => {
        const section = document.getElementById(id);
        if (section) {
            const head = document.getElementById(id + '-head');
            if (head) {
                head.style.top = '0' + 'px';
            }
        }
    }
    useEffect(()=>{
        if(index === 0){setFirstHiddenHeaderPosition();}
    },[])
    return (
        <div id={id} className={style['paralax-section'] + " " +className + ( id === 'end' ? " " + style['end'] : "") }>
            {withHeadFiller && index !== 0 && <div className={style['head']} id={id + '-head'}/>}
            {children}
        </div>
    );
};

export default ParalaxSection;