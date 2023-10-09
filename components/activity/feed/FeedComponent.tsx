import React from 'react';
import style from './feed-component.module.css';

interface FeedComponentProps {

}

const FeedComponent: React.FC<FeedComponentProps> = ({}) => {
    return (
        <div className={style['feed-component']}>
            FeedComponent
        </div>
    );
};

export default FeedComponent;