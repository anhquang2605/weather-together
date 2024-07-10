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
        if (!sectionHeader) return;
        const currentLeft = leftPositionCalculator(sectionHeader);
        if(entries[0].isIntersecting){
            //remove the target from the parent element
           sectionHeader.classList.remove(style['sticky']);
           sectionHeader.style.left = 0 + 'px';
           sectionHeader.style.transform = '-translateX(50%)';
        }else{
            sectionHeader.classList.add(style['sticky']);
            sectionHeader.style.transform = 'translateX(0px)';
            sectionHeader.style.left = (currentLeft) + 'px';
        }
}
/**
 * Calculates the left position of the target element relative to its parent element.
 * This function is used to determine the correct position of the sticky section header.
 * 
 * @param {HTMLElement} sectionHeader - The target element.
 * @returns {number} The left position of the target element.
 */
const leftPositionCalculator = (sectionHeader: HTMLElement): number | undefined => {
    // Get the first child element of the section header
    const headerBar = sectionHeader.childNodes[0] as HTMLElement;

    // If the header bar element is not found, return undefined
    if (!headerBar) return;

    // Get the first child element of the header bar
    const headOfTheGang = headerBar.childNodes[0] as HTMLElement;

    // Calculate the left position of the first child element
    return headOfTheGang.getBoundingClientRect().left;
}
const getLeftUsingWidth = (sectionHeader: HTMLElement): number | undefined => {
    
}
const resizeLeftPositionCalculator = (sectionHeader: HTMLElement): number | undefined => {
    
}
const resizeOberserverHandler = (entries: ResizeObserverEntry[]) => {
    for(const entry of entries){
        const clientRectWidth = entry.contentRect.width;
        if(clientRectWidth > 0){
            const sectionHeader: HTMLElement | null = document.querySelector(`.${style['section-header']}`);
            if (!sectionHeader) return;
            const currentLeft = leftPositionCalculator(sectionHeader);
            sectionHeader.style.left = (currentLeft) + 'px';
        }
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
                const intersectObserver = new IntersectionObserver(observerHandler,observerConfig);
                const resizeObserver =  new ResizeObserver(resizeOberserverHandler);
                intersectObserver.observe(target);
                resizeObserver.observe(target);
                return () => {
                    resizeObserver.unobserve(target);
                    intersectObserver.unobserve(target);
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