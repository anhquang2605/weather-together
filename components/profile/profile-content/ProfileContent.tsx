import React, { useEffect, useState } from 'react';
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
    'activity'
  ]
const DEBOUNCE_TIME = 1000;
const ProfileContent: React.FC<ProfileContentProps> = ({scrollContainerClassname = ""}) => {
    //STATES
    const [currentSection, setCurrentSection] = useState(0);
    const [scrolledDistance, setScrolledDistance] = useState(0);
    const [scrollPositions, setScrollPositions] = useState<number[]>([]);
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
    const onScrollHandler = (event: React.UIEvent) => {
      const scrolledDistance = event.currentTarget.scrollTop;
      setScrolledDistance(scrolledDistance);
    }
    const resizeObservedHandler = (entries: ResizeObserverEntry[]) => {
      const positions = getScrollPositions(sections);
      setScrollPositions(positions);
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
    //EFFECTS
    useEffect(()=>{
      //set up resize observer for the profile content
      const target = document.querySelector(`.${style['profile-content']}`);
      if(target){
        const resizeObserver = new ResizeObserver(debounce( resizeObservedHandler,DEBOUNCE_TIME));
        resizeObserver.observe(target);
        return () => {
          resizeObserver.unobserve(target);
        }
      }
    },[])
    return (
        <div className={style['profile-content']}>
            <SectionHeader sections={sections} isSticky={true} currentSectionIndex={currentSection}  level={4} />
            <ParalaxScroller
                  intersectionHandler={handleInterSection}
                  secctionIds={sections}
                  snapToSections={true}
                  scrollSpeed={0.5}
                  scrollClassName={scrollContainerClassname}
                 >
                    {
                      sections.map((section, index) => {
                        return (
                          <ParalaxSection
                            key={index}
                            id={section}
                            className=""
                          > 
                            {section[0].toUpperCase() + section.slice(1)}
                            An elf is a mythical creature often depicted as a small, magical being with pointed ears and a mischievous nature. They are commonly associated with folklore and fantasy literature, where they are portrayed as graceful and ethereal beings. Elves are often described as having a deep connection with nature and possessing extraordinary abilities, such as exceptional agility and keen senses. In various mythologies, elves are known to be skilled craftsmen and guardians of the forests. They are often depicted as wise and long-lived, with a strong affinity for magic.
                          </ParalaxSection>
                        )
                      })
                    }
                 </ParalaxScroller>
        </div>
    );
};

export default ProfileContent;

