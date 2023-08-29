import React from 'react';
import style from './requests-list.module.css';
import { UserInSearch } from '../../../../types/User';

interface RequestsListProps {
    users: UserInSearch[];
}

const RequestsList: React.FC<RequestsListProps> = ({}) => {
    return (
        <div className={style['requests-list']}>
            RequestsList
        </div>
    );
};

export default RequestsList;