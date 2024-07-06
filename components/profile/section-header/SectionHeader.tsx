import React, { useEffect } from 'react';
import style from './section-header.module.css';
import HeaderBar from './header-bar/HeaderBar';
import HeaderTitlesGroup from './header-titles-group/HeaderTitlesGroup';

interface SectionHeaderProps {
    currentSectionIndex?: number;
    sections: string[];
    isSticky?: boolean;//stick when scrolled out of view
}
const observerHandler = (entries: IntersectionObserverEntry[]) => {
    
        if(entries[0].isIntersecting){
            entries[0].target.classList.add(style['sticky']);
        }else{
            entries[0].target.classList.remove(style['sticky']);
        }
        
}

const SectionHeader: React.FC<SectionHeaderProps> = ({currentSectionIndex = 0, sections, isSticky}) => {
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