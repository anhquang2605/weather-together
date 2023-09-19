import React from 'react';
import style from './buddy-tag-result.module.css';
import { BuddyTag } from '../../../../../../types/BuddyTag';

interface BuddyTagResultProps {
    results: BuddyTag[];
}

const BuddyTagResult: React.FC<BuddyTagResultProps> = ({}) => {
    return (
        <div className={style['buddy-tag-result']}>
            BuddyTagResult
        </div>
    );
};

export default BuddyTagResult;