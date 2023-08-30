import React from 'react';
import style from './request-card.module.css';
import { UserInFriendRequests } from '../../../../../types/User';
import MiniAvatar from '../../../../activity/mini-avatar/MiniAvatar';
import { RAINBOW_COLORS } from '../../../../../constants/rainbow-colors';
import {IoLocation} from 'react-icons/io5'
import Image from 'next/image';
interface RequestCardProps {
    user: UserInFriendRequests;
    index: number;
    curMode: number;
    updater: (index: number, fields: Partial<UserInFriendRequests>) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({user, curMode, index, updater}) => {
    const color = RAINBOW_COLORS[Math.floor(Math.random() * RAINBOW_COLORS.length)];
    return (
        <div className={style['request-card']}>
            <div className={style['background-image']}>
                {
                    user.associatedBackgroundPicture === "" ?
                    <div style={{backgroundColor: color}} className='w-full h-full'>

                    </div>
                    :
                    <Image width={400} height={200} src={user.associatedBackgroundPicture} alt="background picture" />
                }

            </div>
            <div className={style['lower-half']}>
                <MiniAvatar 
                    username={user.username}
                    profilePicturePath={user.associatedProfilePicture}
                    size= "extra-large"
                    className={`shadow-md -mt-16 border-slate-200 ${style['avatar']}`}
                />
                <div className={style['information']}>
                    <div className={style['name']}>
                        {
                            (user.associatedFirstName !== "" || user.associatedLastName !== "" )?
                            `${user.associatedFirstName} ${user.associatedLastName}`:
                            user.username
                        }
                    </div>
                    <div className={style['location']}>
                        <IoLocation className="w-5 h-5 mr-1"/> {user.associatedLocation.city}
                    </div>
                    {
                        curMode === 1 ?
                        <div className={`${style['status']} ${style[user.status]}`}>
                            {user.status}
                        </div>
                        :
                        <div className={`${style['accept-btn']} ${style['status']}`}>
                            Accept
                        </div>
                    }
                </div>
            </div>

            
        </div>
    );
};

export default RequestCard;