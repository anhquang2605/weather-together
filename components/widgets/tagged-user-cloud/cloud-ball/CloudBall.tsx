import React from 'react';
import style from './cloud-ball.module.css';
import { UserCloud } from '../TaggedUserCloud';
import MiniAvatar from '../../../user/mini-avatar/MiniAvatar';

interface CloudBallProps {
    user: UserCloud;
    overloaded?: boolean;
}

const CloudBall: React.FC<CloudBallProps> = ({user, overloaded}) => {
    return (
        <div className={style['cloud-ball']}>
                <MiniAvatar
                    username={user.username}
                    profilePicturePath={user.profilePicture}
                    size='small'
                />
                <span className={style["title-name"]}>
                    {user.name ? user.name : user.username}
                </span>
        </div>
    );
};

export default CloudBall;