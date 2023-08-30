import React from 'react';
import style from './request-card.module.css';
import { UserInFriendRequests } from '../../../../../types/User';
import MiniAvatar from '../../../../activity/mini-avatar/MiniAvatar';

interface RequestCardProps {
    user: UserInFriendRequests
}

const RequestCard: React.FC<RequestCardProps> = ({user}) => {
    return (
        <div className={style['request-card']}>
            <MiniAvatar 
                username={user.username}
                profilePicturePath={user.associatedProfilePicture}
                size= "large"
            />
            
        </div>
    );
};

export default RequestCard;