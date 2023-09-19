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
        <div className={style['cloud-ball'] + " " + (overloaded? style['over-loaded'] : '')}>
                <MiniAvatar
                    username={user.username}
                    profilePicturePath={user.profilePicture}
                    size='small'
                />

        </div>
    );
};

export default CloudBall;