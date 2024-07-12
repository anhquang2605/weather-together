import React, { useEffect } from 'react';
import style from './paralax-scroller.module.scss';
type AnimatorFunction = () => void;
interface AnimatorFunctionMap {
    [key: string]: AnimatorFunction;//id of each sectionmapped to animation function
}

interface ParalaxScrollerProps {
    children: React.ReactNode;
    secctionIds: string[];
    scrollSpeed?: number;
    snapToSections?: boolean;
    intersectionHandler: (id: string) => void;
    sectionIndex?: number;
    scrollClassName: string;
    getScrollDistance?: (sectionIndex: number) => number;
    getScrollPosition?: () => number;
}

const ParalaxScroller: React.FC<ParalaxScrollerProps> = (props) => {
    const { sectionIndex, secctionIds, scrollSpeed, snapToSections, intersectionHandler,scrollClassName } = props;
    const { children } = props;
    const handleInterSection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting){
                const id = entry.target.id as string;
                intersectionHandler(id);
            }
        });
    }
    useEffect(()=> {
        const observer = new IntersectionObserver(handleInterSection, {
            root: document.querySelector(`.${scrollClassName}`) ,
            threshold: 0.5,

        });
        secctionIds.forEach((id) => {
            const element = document.getElementById(id);
            if(element){
                observer.observe(element);
            }
        });
        return () => {
            secctionIds.forEach((id) => {
                const element = document.getElementById(id);
                if(element){
                    observer.unobserve(element);
                }
            });
        }
    },[])
    return (
        <div className={style['paralax-scroller']}>
            {
                children
            }
        </div>
    );
};

export default ParalaxScroller;