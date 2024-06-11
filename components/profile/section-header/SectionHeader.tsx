import React from 'react';
import style from './section-header.module.css';

interface SectionHeaderProps {

}

const SectionHeader: React.FC<SectionHeaderProps> = ({}) => {
    return (
        <div className={style['section-header']}>
            SectionHeader
        </div>
    );
};

export default SectionHeader;