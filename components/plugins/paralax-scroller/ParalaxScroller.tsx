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
    id?: string;
}

const ParalaxScroller: React.FC<ParalaxScrollerProps> = (props) => {
    const lastIntersectionIdRef = useRef<string>('');
    const isUpRef = useRef<boolean>(false);
    const {  secctionIds, intersectionHandler,scrollClassName,   isUp = false,isInProgress = false, id } = props;
    const { children } = props;
    const handleInterSection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        
        entries.forEach((entry) => {
            if(entry.isIntersecting){
                const id = entry.target.id as string;
            
                if(isUpRef.current && !haveIntersected(id)){
                    return;
                }
/*                 if(!haveIntersected(id)){
                    setLastIntersectionId(id);
                }else{
                    return; //I thought that the result would be stored and re triggered
                } */
                
                addCurrentSection(id);
            }
        });
    }
    const handleInterSectionUp = (entries: IntersectionObserverEntry[]) => {
        for (let entry of entries) {
            if( entry.isIntersecting){
                const id = (entry.target.id as string).replace('-head', '');
                if (haveIntersected(id)) return; 
/*                 if(!haveIntersected(id)){
                    setLastIntersectionId(id);
                }else{
                    return;
                } */
                addCurrentSection(id);
            }
        }
    }
    const haveIntersected = (id:string) => {
        return lastIntersectionIdRef.current === id
    }
    const addCurrentSection = (id: string) => {
        lastIntersectionIdRef.current = id
        intersectionHandler(id);
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
        isUpRef.current = isUp;
        if(!isInProgress){
            const configuration: IntersectionObserverInit = {
                //rootMargin: `0px 0px ${isUp ? '-100%' : '0px'} 0px`,
                threshold: 0
            }
            updateObserver(
                configuration
                ,isUp
            );
        }
    },[isInProgress, isUp])
    useEffect(() => {
        return () => {
            observerRef.current?.disconnect();
        }
    },[])
    return (
        <div id={id} className={style['paralax-scroller']}>
            {
                children
            }
        </div>
    );
};

export default ParalaxScroller;

// current problem: when down scrolling is in active, scrolling up will cause the previous section to be intersected this happen when scrolling down until the previous section is obmitted.