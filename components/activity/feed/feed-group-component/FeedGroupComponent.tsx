import React from 'react';
import style from './feed-group-component.module.css';
import { FeedGroup } from '../../../../types/Feed';

interface FeedGroupComponentProps {
    feedGroup: FeedGroup;
}

const FeedGroupComponent: React.FC<FeedGroupComponentProps> = ({}) => {
    return (
        <div className={style['feed-group-component']}>
            
        </div>
    );
};

export default FeedGroupComponent;