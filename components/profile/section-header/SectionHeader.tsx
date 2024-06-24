import React from 'react';
import style from './section-header.module.css';
import HeaderBar from './header-bar/HeaderBar';
import HeaderTitlesGroup from './header-titles-group/HeaderTitlesGroup';

interface SectionHeaderProps {
    currentSectionIndex?: number;
    sections: string[];
}

const SectionHeader: React.FC<SectionHeaderProps> = ({currentSectionIndex = 0, sections}) => {
    return (
        <div className={style['section-header']}>
            <HeaderBar currentIndex={currentSectionIndex} numberOfSections={sections.length}/>
            <HeaderTitlesGroup titles={sections}/>
        </div>
    );
};

export default SectionHeader;