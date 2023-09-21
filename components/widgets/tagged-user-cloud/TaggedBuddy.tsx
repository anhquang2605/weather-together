import React, { useEffect, useState } from 'react';
import style from './tagged-user-cloud.module.css';
import CloudBall from './cloud-ball/CloudBall';
import { BuddyTag } from '../../activity/post/post-form/friend-tag-form/BuddyTagForm';

interface TaggedBuddyProps {
    removeItem: (item: BuddyTag) => void;
    items: Set<BuddyTag>;
}

const TaggedBuddy: React.FC<TaggedBuddyProps> = (props) => {
    const {removeItem, items} = props;
    const [overloaded, setOverloaded] = useState<boolean>(false);
    const cloudsJSX = Array.from(items).map((item,index) => {
        return (
            <CloudBall
                removeItem={removeItem}
                last={index === items.size - 1}
            key={index}
                user={item}
                overloaded={overloaded}
            />
        )
    })
    return (
        items.size > 0 &&
        <div className={style['tagged-user-cloud']}>

                    <span className={style['title']}>
                        Tagged Buddies
                    </span>
                
                <div className={style['tagged-list']}>
                    {cloudsJSX}
                </div>

        </div>
    );
};

export default TaggedBuddy;