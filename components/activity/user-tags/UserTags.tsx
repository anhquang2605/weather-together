import React, { useEffect, useState } from 'react';
import style from './user-tags.module.css';
import { insertToPostAPI } from '../../../libs/api-interactions';
import { UserBasic } from '../../../types/User';
import {FaUserTag} from 'react-icons/fa';
import UserTag from './user-tag/UserTag';
import { useModalContext } from '../../modal/ModalContext';
import TaggedUserList from './tagged-users-list/TaggedUsersList';
interface UserTagsProps {
    usernames: string[];
    limit?: number;
    username: string;
}

const UserTags: React.FC<UserTagsProps> = (props) => {
    const { usernames, limit=5, username } = props;
    const [users, setUsers] = useState<UserBasic[]>([]);
    const {setContent, setShowModal, setContainerClassName, setTitle} = useModalContext(); 
    const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle'); //TODO: use this to show loading indicator
    const handleFetchUsers = async () => {
       setApiStatus('loading');
        const path = `user/by-usernames-basic`;
       const result = await insertToPostAPI(path, usernames);
       if(result.success){
              setApiStatus('success');
              setUsers(result.data);
       }else{
              setApiStatus('failed');
       }
       
    };

    const handleViewTags = () => {
        const content = <TaggedUserList 
                            usernames={usernames}
                            username={username}
                        />
        setShowModal(true);
        setContent(content);
        setContainerClassName(style['tagged-users-list-modal-content']);
        setTitle('Tagged Users');
    }
    useEffect(()=> {
        handleFetchUsers();
    },[])
    return (
        <div className={style['user-tags']}>
            <span className={`${style['tag-label']}`}>
                Tags
            </span> 
            {users && <div className={style['user-tags__user-list']}>
                {
                    users.slice(0,limit).map((user)=> {
                        return <UserTag
                            key={user.username}
                            user={user}
                                />
                    })
                }
            </div>}
            {usernames.length > limit && 
            <>
                and 
                <span onClick={handleViewTags} className={`${style['tag-counts']}`}>
                        <span className={style['other-users-link']}>
                            {usernames.length - limit} others
                        </span>
                        <div className={style['user-brief-list']}>
                            {
                               users.slice(limit).map((user) => {
                                    return <span key={user.username}>
                                        {user.name ? user.name : user.username}
                                    </span>
                                })
                            }
                        </div>        
                </span>
            </>
          
            }
        </div>
    );
};

export default UserTags;