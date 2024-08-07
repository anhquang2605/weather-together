import React, { useEffect, useRef, useState } from 'react';
import style from './profile-content.module.css';
import ParalaxSection from '../../plugins/paralax-scroller/paralax-section/ParalaxSection';
import ParalaxScroller from '../../plugins/paralax-scroller/ParalaxScroller';
import { User } from '../../../types/User';
import SectionHeader from '../section-header/SectionHeader';
import { debounce } from 'lodash';

interface ProfileContentProps {
    scrollContainerClassname?: string;
    user: User;

}
const sections = [
    'about_me',
    'bio',
    'activity',
    'end'
  ]
const DEBOUNCE_TIME = 1000;
const ProfileContent: React.FC<ProfileContentProps> = ({scrollContainerClassname = ""}) => {
    //STATES
    const [currentSection, setCurrentSection] = useState(0);
    const [scrolledDistance, setScrolledDistance] = useState(0);
    const [scrollPositions, setScrollPositions] = useState<number[]>([]);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [scrolledFromCurrentSection, setScrolledFromCurrentSection] = useState(0);
    const [destinationScrollPosition, setDestinationScrollPosition] = useState(0);
    const [currentIndexPosition, setCurrentIndexPosition] = useState(0);
    const [nextSectionIndex, setNextSectionIndex] = useState(1);
    const [snappedPosition, setSnappedPosition] = useState(0);
    const [isDirectionFlipped, setIsDirectionFlipped] = useState(false);
    const [isInProgress, setIsInProgress] = useState(false);//when the liquid bar is determined
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
      const profileContent: HTMLElement | null = document.querySelector(`.${style['profile-content']}`);
      if(!profileContent) return;
      const currentScrollTop = target.scrollTop + (profileContent.offsetTop) ;
      const oldScrollDistance = scrollDistanceRef.current || 0;
      setScrolledDistance(currentScrollTop);
      setIsScrollingUp(currentScrollTop < oldScrollDistance);
/*       const scrolledDistance = event.target.;
      setScrolledDistance(scrolledDistance); */
    }
    const positionsGetAndSet = () => {
      const profileContent: HTMLElement | null = document.querySelector(`.${style['profile-content']}`);
      const scrollContainer: HTMLElement | null = document.querySelector(`.${scrollContainerClassname}`);
      if(!profileContent || !scrollContainer) return;
      const positions = getScrollPositions(sections);
      const containerStyle = window.getComputedStyle(scrollContainer);
      positions[0] = positions[0] + (profileContent?.offsetTop || 0) + (parseInt(containerStyle.paddingTop.replace('px', '')) || 0);
      setScrollPositions(positions);
      setCurrentIndexPosition(positions[currentSectionRef.current]);
    }
    const resizeObservedHandler = (entries: ResizeObserverEntry[]) => {
      positionsGetAndSet();
    }
    const getScrollPositions = (ids: string[]) => {
      const positions:number[] = []
      for(let id of ids){
        const section = document.getElementById(id);
        if(section){
          positions.push(section.offsetTop);
        }
      }
      return positions;
    }
    const scrollToCurrentSection = (index: number) => {
      const scrollContainer: HTMLElement | null = document.querySelector(`.${scrollContainerClassname}`);
      if(!scrollContainer) return;
      scrollContainer.scrollTo({top: scrollPositions[index], behavior: 'smooth'});
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

    useEffect(()=>{
      if(!scrollPositions ) return;
      currentSectionRef.current = currentSection;
      setIsInProgress(false);
      setIsDirectionFlipped(false);
      //setIsDirectionFlipped(false);
      //setSnappedPosition(scrolledDistance);
      //setCurrentIndexPosition(scrolledDistance)
      setCurrentIndexPosition(scrollPositions[currentSection]);
    },[currentSection, scrollPositions])
    //when next section index changes, determine direction to know which edge to fill, especially for node in the middle
        //when current section changes
        useEffect(()=>{
          scrollDistanceRef.current = scrolledDistance;
          let distance = scrolledDistance - currentIndexPosition;
         //console.log(distance);
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
      if(!isInProgress){
        setScrolledFromCurrentSection(0);
        if(!isScrollingUp || currentSection === 0){
          setNextSectionIndex(currentSection + 1);
        } else if(isScrollingUp || currentSection === sections.length - 1){
          setNextSectionIndex(currentSection - 1);
        }
        setIsInProgress(true);
      }
    },[isInProgress])
    useEffect(()=>{
      if(!scrollPositions) return;
      setDestinationScrollPosition(scrollPositions[nextSectionIndex] - scrollPositions[currentSection]);
    },[nextSectionIndex, scrollPositions])
    //Food for thought:
    //One the way back up, reverse the direction of the liquid bar, and the intersection somehow.
    return (
        <div className={style['profile-content']}>
            <SectionHeader sections={sections} isSticky={true} currentSectionIndex={currentSection} isScrollingUp={isScrollingUp} progress={scrolledFromCurrentSection / destinationScrollPosition}  level={4} nextIndex={nextSectionIndex} setCurrentSection={scrollToCurrentSection} />
            <ParalaxScroller
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
                            id={section}
                            className=""
                            withHeadFiller={true}
                          > 
                            {section[0].toUpperCase() + section.slice(1)}
                          </ParalaxSection>)
                        }
                        return (
                          <ParalaxSection
                            key={index}
                            id={section}
                            className=""
                            withHeadFiller={true}
                          > 
                            {section[0].toUpperCase() + section.slice(1)}
                            An elf is a mythical creature often depicted as a small, magical being with pointed ears and a mischievous nature. They are commonly associated with folklore and fantasy literature, where they are portrayed as graceful and ethereal beings. Elves are often described as having a deep connection with nature and possessing extraordinary abilities, such as exceptional agility and keen senses. In various mythologies, elves are known to be skilled craftsmen and guardians of the forests.
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