import React, { useEffect } from 'react';
import style from './paralax-scroller.module.scss';
type AnimatorFunction = () => void;
interface AnimatorFunctionMap {
    [key: string]: AnimatorFunction;
}

interface ParalaxScrollerProps {
    children: React.ReactNode;
    secctionIds: string[];
    scrollSpeed?: number;
    snapToSections?: boolean;
    introAnimationHandlersMap: AnimatorFunctionMap;
    sectionIndex?: number;
    scrollClassName: string;
}

const ParalaxScroller: React.FC<ParalaxScrollerProps> = (props) => {
    const { sectionIndex, secctionIds, scrollSpeed, snapToSections, introAnimationHandlersMap,scrollClassName } = props;
    const { children } = props;
    const handleInterSection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting){
                const id = entry.target.id as string;
                console.log(id);
                const handler = introAnimationHandlersMap[id];
                handler();
            }
        });
    }
    useEffect(()=> {
        const observer = new IntersectionObserver(handleInterSection, {
            root: document.querySelector(`.${scrollClassName}`) ,
            rootMargin: '0px',
            threshold: 0.5,

        });
        secctionIds.forEach((id) => {
            console.log(id);
            const element = document.getElementById(id);
            console.log(element);
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