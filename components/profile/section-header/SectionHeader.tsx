import React, { useEffect } from 'react';
import style from './section-header.module.css';
import HeaderBar from './header-bar/HeaderBar';
import HeaderTitlesGroup from './header-titles-group/HeaderTitlesGroup';

interface SectionHeaderProps {
    currentSectionIndex?: number;
    sections: string[];
    isSticky?: boolean;//stick when scrolled out of view
    parentClassName?: string;
}
//temporary solution
//Remove the target then add it to the remaining estate element, then add the sticky class so that it would become abosolutely positioned this way the section header would be sticky but relative to the remmaing estate element not to the window (because of the fixed position)
//Issues: 1.Cannot add class to the target during the observer handler because the target will change which trigger re-rendering which will cause the useEffect to run again resulting in looping 
const SectionHeader: React.FC<SectionHeaderProps> = ({currentSectionIndex = 0, sections, isSticky, parentClassName=''}) => {
    const observerHandler = (entries: IntersectionObserverEntry[]) => {
        const target = entries[0].target;
        const parent = document.querySelector(parentClassName)
        const remainingEstate = document.querySelector(`.remaing-estate`);
        if(entries[0].isIntersecting){
            
            //remove the target from the parent element
            target.classList.remove(style['sticky']);
            remainingEstate?.removeChild(target);    
            parent?.appendChild(target);
        }else{
            target.classList.add(style['sticky']);
            parent?.removeChild(target);
            remainingEstate?.appendChild(target);
            entries[0].target.classList.remove(style['sticky']);
        }
        
}
    useEffect(()=>{
        const observerConfig = {
            root: null,
            rootMargin: '50px',
            threshold: 0.5,
        };
        const target = document.querySelector(`.${style['section-header']}`);
        if(target){
            const observer = new IntersectionObserver(observerHandler,observerConfig);
            observer.observe(target);
            return () => {
                observer.unobserve(target);
            }
        }
        
    },[])
    return (
        <div className={style['section-header'] }>
            <HeaderBar currentIndex={currentSectionIndex} titles={sections}/>
        </div>
    );
};

export default SectionHeader;