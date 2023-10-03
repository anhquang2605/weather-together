import React, { useEffect, useState } from 'react';
import style from './user-tags.module.css';
import { insertToPostAPI } from '../../../libs/api-interactions';
import { UserInClient } from '../../../types/User';
import {FaUserTag} from 'react-icons/fa';
import UserTag from './user-tag/UserTag';
interface UserTagsProps {
    usernames: string[];
}

const UserTags: React.FC<UserTagsProps> = (props) => {
    const { usernames } = props;
    const [users, setUsers] = useState<UserInClient[]>([]);
    const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle'); //TODO: use this to show loading indicator
    const handleFetchUsers = async () => {
       setApiStatus('loading');
        const path = `user/by-usernames`;
       const result = await insertToPostAPI(path, usernames.slice(0,5));
       if(result.success){
              setApiStatus('success');
              setUsers(result.data);
       }else{
              setApiStatus('failed');
       }
       
    };
    useEffect(()=> {
        handleFetchUsers();
    },[])
    return (
        <div className={style['user-tags']}>
            <span className={`${style['tag-label']} font-bold`}>
                Tagged 
                {usernames.length > 5 && <span className={`${style['tag-counts']}`}>
                    {usernames.length}
                </span>
}            </span> 
            {users && <div className={style['user-tags__user-list']}>
                {
                    users.map((user)=> {
                        return <UserTag
                            key={user.username}
                            user={user}
                                />
                    })
                }
            </div>}
        </div>
    );
};

export default UserTags;