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
    const loadLimit = 3;
    const [overloaded, setOverloaded] = useState<boolean>(false);
    const cloudsJSX = Array.from(items).map((item,index) => {
        return (
            <CloudBall
            key={index}
                user={item}
                overloaded={overloaded}
            />
        )
    })
    useEffect(()=>{
        if(items.size > loadLimit){
            setOverloaded(true);
        }
        else{
            setOverloaded(false);
        }
    },[overloaded])
    return (
        <div className={style['tagged-user-cloud']}>
            <div className="absolute h-4 w-full">
                {cloudsJSX}
            </div>
        </div>
    );
};

export default TaggedUserCloud;