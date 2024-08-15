import React, { useEffect, useRef, useState } from 'react';
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
    const [lastIntersectionId, setLastIntersectionId] = useState<string>('');
    const { sectionIndex, secctionIds, scrollSpeed, snapToSections, intersectionHandler,scrollClassName,  withCounterpart, isUp = false,isInProgress = false } = props;
    const { children } = props;
    const handleInterSection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        console.log('down handler');
        entries.forEach((entry) => {
            if(entry.isIntersecting){
                const id = entry.target.id as string;
/*                 if(!haveIntersected(id)){
                    setLastIntersectionId(id);
                }else{
                    return; //I thought that the result would be stored and re triggered
                } */
                intersectionHandler(id);
            }
        });
    }
    const handleInterSectionUp = (entries: IntersectionObserverEntry[]) => {
        for (let entry of entries) {
            if( entry.isIntersecting){
                const id = (entry.target.id as string).replace('-head', '');
/*                 if(!haveIntersected(id)){
                    setLastIntersectionId(id);
                }else{
                    return;
                } */
                intersectionHandler(id);
            }
        }
    }
    const haveIntersected = (id:string) => {
        return lastIntersectionId === id
    }
    const observerRef = useRef<IntersectionObserver>();
    const updateObserver = (config: IntersectionObserverInit, isUp: boolean) => {

        if(observerRef.current){
            //console.log(observerRef.current);
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
        //console.log(`${isUp ? 'up' : 'down'} observer created`);
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
                threshold: isUp ? 1:0
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

// current problem: when down scrolling is in active, scrolling up will cause the previous section to be intersected this happen when scrolling down until the previous section is obmitted.