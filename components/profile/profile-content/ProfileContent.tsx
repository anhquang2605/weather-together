import React, { useEffect, useState } from 'react';
import style from './profile-content.module.css';
import ParalaxSection from '../../plugins/paralax-scroller/paralax-section/ParalaxSection';
import ParalaxScroller from '../../plugins/paralax-scroller/ParalaxScroller';
import { User } from '../../../types/User';
import SectionHeader from '../section-header/SectionHeader';

interface ProfileContentProps {
    scrollContainerClassname?: string;
    user: User;
}
const sections = [
    'about_me',
    'bio',
    'activity'
  ]

const ProfileContent: React.FC<ProfileContentProps> = ({scrollContainerClassname = ""}) => {
    //STATES
    const [currentSection, setCurrentSection] = useState(0);
    const [scrollDistance, setScrollDistance] = useState(0);
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
    //EFFECTS
    useEffect(() => {
        setScrollDistance(getScrollContainerScrollTop())
    },[currentSection])
    useEffect(() => {
      console.log(scrollDistance);
    },[scrollDistance])
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

