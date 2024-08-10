import React, { useEffect, useRef } from 'react';
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
    threshold?: number;//for intersection reverse
    withCounterpart?: boolean;
    isUp?: boolean;//going up or down
    isInProgress?: boolean;
}

const ParalaxScroller: React.FC<ParalaxScrollerProps> = (props) => {
    const { sectionIndex, secctionIds, scrollSpeed, snapToSections, intersectionHandler,scrollClassName,  withCounterpart, isUp = false,isInProgress = false } = props;
    const { children } = props;
    const handleInterSection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting){
                let id = entry.target.id as string;
                intersectionHandler(id);
            }
        });
    }
    const handleInterSectionUp = (entries: IntersectionObserverEntry[]) => {
        for (let entry of entries) {
            if( entry.isIntersecting){
                const id = (entry.target.id as string).replace('-head', '');
                intersectionHandler(id);
            }
        }
    }
    const observerRef = useRef<IntersectionObserver>();
    const updateObserver = (config: IntersectionObserverInit, isUp: boolean) => {

        if(observerRef.current){
            observerRef.current.disconnect();
        }
        const configuration: IntersectionObserverInit = {
            root: document.querySelector(`.${scrollClassName}`) ,
            ...config
        }
        observerRef.current = createObserver(configuration, isUp);
    }
    const createObserver = (configuration: IntersectionObserverInit, isUp: boolean) => {
        const observer = isUp ? new IntersectionObserver(handleInterSectionUp,configuration) : new IntersectionObserver(handleInterSection,configuration);
        //const observer = new IntersectionObserver(handleInterSection,configuration);
        secctionIds.forEach((id) => {
            let joinedId = id;
            if (isUp) {
                joinedId = id + '-head';//hidden element for revesed way
            } 
            const element = document.getElementById(joinedId);
            if(element){
                observer.observe(element);
            }
        });
        return observer;
    }

    useEffect(() => {
        if(!isInProgress){
            const configuration: IntersectionObserverInit = {
                //rootMargin: `0px 0px ${isUp ? '-100%' : '0px'} 0px`,
                threshold: isUp ? 1 : 0
            }
            updateObserver(
                configuration
                ,isUp
            );
        }
    },[isInProgress])
    useEffect(() => {
        return () => {
            observerRef.current?.disconnect();
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