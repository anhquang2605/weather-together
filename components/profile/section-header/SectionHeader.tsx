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
        const result = getLeftUsingParent(sectionHeader, level);
        const currentLeft = result ? result[0] : 0;
        const parentWidth = result ? result[1] : 0;
       
        if(entries[0].isIntersecting){
            //remove the replacement
            const replacement = document.querySelector('.replacement');
            if(replacement) replacement.remove();
            //remove the target from the parent element
           sectionHeader.classList.remove(style['sticky']);

           sectionHeader.style.left = 0 + 'px';
           sectionHeader.style.width = 'auto';
        }else{
            //replacement created to prevent disallocation of the seciont header that cause resize observer to run again
            const replacement = sectionHeader.cloneNode(true) as HTMLElement;
            replacement.classList.add('replacement');
            replacement.style.opacity = '0';
            //const sectionClientRect = sectionHeader.getBoundingClientRect();
            /* const sectionWidth = sectionClientRect.width;
            const sectionHeight = sectionClientRect.height;
            
            replacement.style.width = sectionWidth + 'px';
            replacement.style.height = sectionHeight + 'px';
 */            sectionHeader.classList.add(style['sticky']);
            sectionHeader.after(replacement);
            sectionHeader.style.left = (currentLeft) + 'px';
            sectionHeader.style.width = parentWidth + 'px';
        }
}
const replacementDivGenerator = () => {
    const replacement = document.createElement('div');
    replacement.classList.add('replacement');
    return replacement
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
/**
 * Calculates the left position of the target element relative to its parent element.
 * The function returns an array with two elements:
 * - The first element is the difference in width between the window and the parent element.
 * - The second element is the width of the parent element.
 *
 * @param {HTMLElement} sectionHeader - The target element.
 * @param {number} level - The level of the parent element to calculate the left position for.
 * @returns {number[] | undefined} An array with two elements representing the left position and width of the parent element.
 */
const getLeftUsingParent = (sectionHeader: HTMLElement, level: number): number[] | undefined => {
    // Start with the parent element of the section header
    let parent = sectionHeader.parentElement;

    // Traverse up the DOM tree until the desired level is reached or no parent element is found
    while(level > 1 && parent){
        parent = parent?.parentElement;
        level--; 
    }

    // If no parent element is found, return undefined
    if(!parent) return;

    // Calculate the difference in width between the window and the parent element
    let parentWidth = parent.getBoundingClientRect().width;
    let widthDiff = window.innerWidth - parentWidth;

    // Return an array with the difference in width and the width of the parent element
    return [widthDiff,parentWidth];
}

const resizeOberserverHandler = (entries: ResizeObserverEntry[]) => {
    for(const entry of entries){
        const clientRectWidth = entry.contentRect.width;
        if(clientRectWidth > 0){
            const sectionHeader: HTMLElement | null = document.querySelector(`.${style['section-header']}`);
            if (!sectionHeader) return;
            const currentLeft = getLeftUsingParent(sectionHeader, level);//level comes from props
            sectionHeader.style.left = (currentLeft) + 'px';
        }
    }
}
    useEffect(()=>{
        if(isSticky){
            const observerConfig = {
                root: null,
                rootMargin: '0px',
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