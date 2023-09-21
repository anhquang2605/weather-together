import React, { useEffect, useState } from 'react';
import style from './tagged-user-cloud.module.css';
import CloudBall from './cloud-ball/CloudBall';
export interface UserCloud{
    username: string;
    name: string;
    profilePicture: string;
}
interface TaggedUserCloudProps {
    removeItem: (item: UserCloud) => void;
    items: Set<UserCloud>;
}

const TaggedUserCloud: React.FC<TaggedUserCloudProps> = (props) => {
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

export default TaggedUserCloud;