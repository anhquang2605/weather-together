import React, { useEffect } from 'react';
import style from './section-header.module.css';
import HeaderBar from './header-bar/HeaderBar';
import HeaderTitlesGroup from './header-titles-group/HeaderTitlesGroup';

interface SectionHeaderProps {
    currentSectionIndex?: number;
    sections: string[];
    isSticky?: boolean;//stick when scrolled out of view
    level?: number;//how deep the header is in the hierarchy away from its ancestor used for width calculation by default it is 1 the direct parent 
}
//temporary solution
//Remove the target then add it to the remaining estate element, then add the sticky class so that it would become abosolutely positioned this way the section header would be sticky but relative to the remmaing estate element not to the window (because of the fixed position)
//Issues: 1.Cannot add class to the target during the observer handler because the target will change which trigger re-rendering which will cause the useEffect to run again resulting in looping 
const SectionHeader: React.FC<SectionHeaderProps> = ({currentSectionIndex = 0, sections, isSticky, level = 1}) => {
    const observerHandler = (entries: IntersectionObserverEntry[]) => {
        const sectionHeader: HTMLElement | null = document.querySelector(`.${style['section-header']}`);
        const window = global.window;

        //if (!window) return;

        if (!sectionHeader) return;
        const headerBar = sectionHeader.childNodes[0] as HTMLElement;
   
        if (!headerBar) return;
        const currentLeft = headerBar.getBoundingClientRect().left;
        console.log(headerBar, currentLeft);
        //getting the inteded accestor for the target
        /* let parentNo = level;
        //parent of the target
        let parent = sectionHeader.parentElement;
        while (parentNo > 1 && parent) {
            parent = parent.parentElement;
            parentNo--;
        }
        if (!parent) return;
        const parentWidth = parent.getBoundingClientRect().width;
        const windowWidth = window.innerWidth;
        const widthDifference = (windowWidth - parentWidth) / 2; */
        if(entries[0].isIntersecting){
            //remove the target from the parent element
           sectionHeader.classList.remove(style['sticky']);
           sectionHeader.style.left = 0 + 'px';
        }else{
            sectionHeader.classList.add(style['sticky']);
            sectionHeader.style.left = currentLeft + 'px';
        }
        
        
}
    useEffect(()=>{
        if(isSticky){
            const observerConfig = {
                root: null,
                rootMargin: '50px',
                threshold: 0.5,
            };
            const target = document.querySelector(`.${style['sticky-filler']}`);
            if(target){
                const observer = new IntersectionObserver(observerHandler,observerConfig);
                observer.observe(target);
                return () => {
                    observer.unobserve(target);
                }
            }
    
        }
    },[])
    return (
        <>
            {isSticky && <span className={style['sticky-filler']}></span>}
            <div key={style['section-header']} className={style['section-header'] }>
                <HeaderBar currentIndex={currentSectionIndex} titles={sections}/>
            </div>
        </>
        
    );
};

export default SectionHeader;