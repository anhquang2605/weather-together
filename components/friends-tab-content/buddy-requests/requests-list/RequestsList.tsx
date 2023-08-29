import React from 'react';
import style from './requests-list.module.css';

interface RequestsListProps {

}

const RequestsList: React.FC<RequestsListProps> = ({}) => {
    return (
        <div className={style['requests-list']}>
            RequestsList
        </div>
    );
};

export default RequestsList;