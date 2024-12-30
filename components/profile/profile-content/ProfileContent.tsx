import React, { useEffect, useRef, useState } from 'react';
import style from './profile-content.module.css';
import ParalaxSection from '../../plugins/paralax-scroller/paralax-section/ParalaxSection';
import ParalaxScroller from '../../plugins/paralax-scroller/ParalaxScroller';
import { User } from '../../../types/User';
import SectionHeader from '../section-header/SectionHeader';
import { debounce, get } from 'lodash';
import Bio from '../sections/bio/Bio';
import AboutMe from '../sections/about-me/AboutMe';
import Activities from '../sections/activities/Activities';
import Gallery from '../sections/gallery/Gallery';
import { profile } from 'console';
import { current } from '@reduxjs/toolkit';
import next from 'next';
import { ne } from '@faker-js/faker';

interface ProfileContentProps {
    scrollContainerClassname?: string;
    user: User;

}
const sections = [
    'about_me',
    'gallery',
    'activities',
    'end'
  ]

const DEBOUNCE_TIME = 1000;
const REFERENCE_ID = 'profile-paralax';
const ProfileContent: React.FC<ProfileContentProps> = ({scrollContainerClassname = "", user}) => {
    const section_components_map: {[key: string]: any} = {
      'about_me': <AboutMe user={user} />,
      'gallery': <Gallery username={user.username}/>,
      'activities': <Activities />,
    }
    //STATES
    const [currentSection, setCurrentSection] = useState(0);
    const [scrolledDistance, setScrolledDistance] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const [scrollPositions, setScrollPositions] = useState<number[]>([]);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [scrolledFromCurrentSection, setScrolledFromCurrentSection] = useState(0);
    const [destinationScrollPosition, setDestinationScrollPosition] = useState(0);
    const [currentIndexPosition, setCurrentIndexPosition] = useState(0);
    const [nextSectionIndex, setNextSectionIndex] = useState(1);
    const [snappedPosition, setSnappedPosition] = useState(0);
    const [isDirectionFlipped, setIsDirectionFlipped] = useState(false);
    const [isInProgress, setIsInProgress] = useState(false);//when the liquid bar is determined
    const [progress, setProgress] = useState(0);
   /*  const [threshold, setThreshold] = useState(1);//for intersection switching 0 when scroll down, 1 when scroll up */
    //REFS
    const scrollDistanceRef = useRef(0);
    const currentSectionRef = useRef(0);
  
    //HELPERS
    const getSectionIndex = (section: string) => {
        return sections.indexOf(section);
    }
    const getScrollContainerScrollTop = () => {
        return document.querySelector(`.${scrollContainerClassname}`)?.scrollTop || 0
    }
    //LOGIC
    const handleInterSection = (id: string) => {
        const sectionIndex = getSectionIndex(id);
        setCurrentSection(sectionIndex);
    }
    const onScrollHandler = (event: Event
    ) => {
      if(!event || !event.target) return;
      const target = event.target as HTMLElement;
      const paralaxScroller = document.getElementById(REFERENCE_ID);
      const profileContent: HTMLElement | null = document.querySelector(`.${style['profile-content']}`);
      if(!profileContent || !paralaxScroller) return;
      const paralaxScrollerTop = paralaxScroller.offsetTop;
      //const profileTopoffset = profileContent.offsetTop;
      let targetScrollTop = target.scrollTop;
      let currentScrollTop = targetScrollTop + paralaxScrollerTop;
      const oldScrollDistance = scrollDistanceRef.current || 0;

      setScrollTop(targetScrollTop);
      setScrolledDistance(currentScrollTop);
      setIsScrollingUp(currentScrollTop < oldScrollDistance);
/*       const scrolledDistance = event.target.;
      setScrolledDistance(scrolledDistance); */
    }
    const positionsGetAndSet = () => {
      const profileContent: HTMLElement | null = document.querySelector(`.${style['profile-content']}`);
      //const paralaxScroller = document.getElementById(REFERENCE_ID);
      const scrollContainer: HTMLElement | null = document.querySelector(`.${scrollContainerClassname}`);
      if(!profileContent || !scrollContainer ) return;
      const positions = getScrollPositions(sections);
      const containerStyle = window.getComputedStyle(scrollContainer);
      //const paralaxScrollerTop = paralaxScroller.offsetTop;
      //positions[0] =  /* (profileContent?.offsetTop || 0) + (parseInt(containerStyle.paddingTop.replace('px', '')) || 0) + */ paralaxScrollerTop;
      setScrollPositions(positions);
      setCurrentIndexPosition(positions[currentSectionRef.current]);
    }
    const resizeObservedHandler = (entries: ResizeObserverEntry[]) => {
      positionsGetAndSet();
    }
    const getScrollPositions = (ids: string[]) => {
      const positions:number[] = [];
      const profileContent: HTMLElement | null = document.querySelector(`.${style['profile-content']}`);
      const paralaxScroller = document.getElementById(REFERENCE_ID);
      const scrollContainer: HTMLElement | null = document.querySelector(`.${scrollContainerClassname}`);
      //const windowHeight = window.innerHeight;
      let i = 0;
      if(!profileContent || !scrollContainer || !paralaxScroller) return positions;
      const paralaxScrollerTop = paralaxScroller.offsetTop;
      for(let id of ids){
        const section = document.getElementById(id);
        const sectionTop = section?.offsetTop || 0;
        let finalTop = sectionTop + paralaxScrollerTop;
 /*        if(i !== 0){
          finalTop = finalTop - windowHeight; 
        } */
/*         if(i !== 0){
          finalTop = finalTop + (parseInt(window.getComputedStyle(scrollContainer).paddingTop.replace('px', '')) || 0);
        } */
        //const finalTop = sectionTop /* + (parseInt(window.getComputedStyle(scrollContainer).paddingTop.replace('px', '')) || 0) + (profileContent.offsetTop || 0) */;
        if(section){
          positions.push(finalTop);
        }
        i++;
      }
      

      //scroll position adjustment, add padding top and off set of the banner since these positions are relative only to the profile content
      return positions;
    }
    
    const scrollToCurrentSection = (index: number) => {
      const scrollContainer: HTMLElement | null = document.querySelector(`.${scrollContainerClassname}`);
      if(!scrollContainer) return;
      scrollContainer.scrollTo({top: scrollPositions[index], behavior: 'smooth'});
    }

    const scrollDistanceCalculator = (currentIndex: number, nextIndex: number, isScrollingUp: boolean, scrollPositions: number[]) => {
      if(scrollPositions.length <= 0) return 0;
      const paralaxScroller = document.getElementById(REFERENCE_ID);
      if(!paralaxScroller) return 0;
      let paralaxScrollerTop = paralaxScroller.offsetTop;
      let nextPosition = scrollPositions[nextIndex];
      let currentPosition = scrollPositions[currentIndex];
      let distance = nextPosition - currentPosition;
      let trueDifferenceBeforeDestination = window.innerHeight - paralaxScrollerTop;
      if(!isScrollingUp){
        distance = distance - trueDifferenceBeforeDestination;
      }
      return distance;
    }
    //EFFECTS
    useEffect(()=>{
      //set up resize observer for the profile content
      const target = document.querySelector(`.${style['profile-content']}`);
      const scrollContainer = document.querySelector(`.${scrollContainerClassname}`);
      if(target && scrollContainer){
        const resizeObserver = new ResizeObserver(debounce( resizeObservedHandler,DEBOUNCE_TIME));
        resizeObserver.observe(target);
        scrollContainer.addEventListener('scroll', onScrollHandler);
        return () => {
          resizeObserver.unobserve(target);
          scrollContainer.removeEventListener('scroll', onScrollHandler);
        }
      }
      
    },[])


    //when next section index changes, determine direction to know which edge to fill, especially for node in the middle
        //when current section changes
        useEffect(()=>{
          scrollDistanceRef.current = scrolledDistance;
          if(scrollTop === 0) 
          {  //to make sure the current section is always 0 when scrolled to top
            handleInterSection(sections[0]);
            return;
          }
          let distance = scrolledDistance - currentIndexPosition;
          console.log(scrolledDistance, currentIndexPosition);
          setScrolledFromCurrentSection(distance);
          if(distance < 0 && !isDirectionFlipped){
            setIsDirectionFlipped(true);
            setIsInProgress(false);
          } else if(distance > 0 && isDirectionFlipped){
            setIsDirectionFlipped(false);
            setIsInProgress(false);
          }
        },[scrolledDistance])
      useEffect(()=>{
        if(!scrollPositions ) return;
        currentSectionRef.current = currentSection;
        setIsInProgress(false);
        setIsDirectionFlipped(false);
        //setIsDirectionFlipped(false);
        //setSnappedPosition(scrolledDistance);
        //setCurrentIndexPosition(scrolledDistance)
        setCurrentIndexPosition(scrollPositions[currentSectionRef.current]);
      },[currentSection])
    useEffect(()=>{
      if(!isInProgress){
        setScrolledFromCurrentSection(0);
        const currentRef = currentSectionRef.current;
        if(!isScrollingUp || currentRef === 0){
          setNextSectionIndex(currentRef + 1);
        } else if(isScrollingUp || currentRef === sections.length - 1){
          setNextSectionIndex(currentRef - 1);
        }
        setIsInProgress(true);
      }
    },[isInProgress])
    useEffect(()=>{
      if(!scrollPositions) return;
      const distanceBetween = scrollDistanceCalculator(currentSection, nextSectionIndex, isScrollingUp, scrollPositions);
      setDestinationScrollPosition(distanceBetween);
    },[nextSectionIndex, scrollPositions])
    useEffect(()=>{
      
      setProgress(scrolledFromCurrentSection / destinationScrollPosition);
    },[scrolledFromCurrentSection, destinationScrollPosition])
    //Food for thought:
    //One the way back up, reverse the direction of the liquid bar, and the intersection somehow.
    return (
        <div className={style['profile-content']}>
            <SectionHeader sections={sections} isSticky={true} currentSectionIndex={currentSection} isScrollingUp={isScrollingUp} progress={progress}  level={4} nextIndex={nextSectionIndex} setCurrentSection={scrollToCurrentSection} />
            <ParalaxScroller
                  id = {REFERENCE_ID}
                  isUp ={isScrollingUp}
                  intersectionHandler={handleInterSection}
                  secctionIds={sections}
                  snapToSections={true}
                  scrollSpeed={0.5}
                  scrollClassName={scrollContainerClassname}
                  isInProgress={isInProgress}
                 >
                    {
                      sections.map((section, index) => {
                        if (section === 'end')
                        {
                          return (<ParalaxSection
                            key={index}
                            index={index}
                            id={section}
                            className=""
                            withHeadFiller={true}
                          > 
                            {""}
                          </ParalaxSection>)
                        }
                        return (
                          <ParalaxSection
                            key={index}
                            index={index}
                            id={section}
                            className=""
                            withHeadFiller={true}
                          > 
                            {
                              section_components_map[section]
                            }
                          </ParalaxSection>
                        )
                      })
                    }
                 </ParalaxScroller>
        </div>
    );
};

export default ProfileContent;

/* Food for thought */
/* Need new approach for scrolling up, should encompass when scrolling from current section from higher index bar to lower bar */