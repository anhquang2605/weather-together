import React from 'react';
import style from './cloud-ball.module.css';
import MiniAvatar from '../../../user/mini-avatar/MiniAvatar';
import {IoClose} from 'react-icons/io5';
import { BuddyTag } from '../../../activity/post/post-form/friend-tag-form/BuddyTagForm';
interface CloudBallProps {
    user: BuddyTag;
    overloaded?: boolean;
    last?: boolean;
    removeItem: (item: BuddyTag) => void;
}

const CloudBall: React.FC<CloudBallProps> = ({user, overloaded, removeItem}) => {
    return (
        <div className={style['cloud-ball'] + " " + style['last']}>
               
                <MiniAvatar
                    username={user.username}
                    profilePicturePath={user.profilePicture}
                    size='medium'
                />
                <span className={style["title-name"]}>
                    {user.name ? user.name : user.username}
                </span>
                <span className={style["untag-btn"]}>
                    <IoClose className="w-6 h-6"
                        onClick={() => {
                            removeItem(user);
                        }}
                    />
                </span>
        </div>
    );
};

export default CloudBall;