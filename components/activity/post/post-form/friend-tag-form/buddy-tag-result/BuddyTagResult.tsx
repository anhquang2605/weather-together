import React from 'react';
import style from './buddy-tag-result.module.css';
import { Buddy } from '../../../../../../types/User';
import BuddyCard from '../../../../../user/buddy-card/BuddyCard';
import { usePostFormContext } from '../../../post-engagement/usePostFormContext';

interface BuddyTagResultProps {
    results: Buddy[];
}

const BuddyTagResult: React.FC<BuddyTagResultProps> = ({results}) => {
    const {taggedUsernames,addTaggedUsername} = usePostFormContext();
    
    const jsxResults = results.map((buddy) => {
        return (
            <BuddyCard onClickHandler={addTaggedUsername} buddy={buddy} hoverTitle='Tag This Buddy'/>
        )
    })
    return (
        <div className={style['buddy-tag-result']}>
            {jsxResults.length > 0 ? jsxResults : <span className={style['no-result']}>No results found</span>}
        </div>
    );
};

export default BuddyTagResult;