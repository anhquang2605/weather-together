import React from 'react';
import style from './feed-component.module.css';
import { Feed } from '../../../../types/Feed';

interface FeedComponentProps {
    feed: Feed
}

const FeedComponent: React.FC<FeedComponentProps> = ({feed}) => {
    return (
        <div className={style['feed-component']}>
            {
                feed.title
            }
        </div>
    );
};

export default FeedComponent;