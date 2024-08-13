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
    const resizeOberserverHandler = () => {
        const section = document.getElementById(id);
        if (section) {
            const sectionRect = section.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const head = document.getElementById(id + '-head');
            if (head) {
                head.style.top = "-" + sectionTop + 'px';
            }
        }
    }
    useEffect(()=>{
        if(index === 0){
            const resizeObserver = new ResizeObserver(resizeOberserverHandler);
            const section = document.getElementById(id);
            resizeObserver.observe(section as Element);
            return () => {
                resizeObserver.disconnect();
            }
        }
    },[])
    return (
        <div id={id} className={style['paralax-section'] + " h-[3000px] " + className + ( id === 'end' ? " " + style['end'] : "") }>
            {withHeadFiller && <div className={style['head']} id={id + '-head'}/>}
            {children}
        </div>
    );
};

export default ParalaxSection;