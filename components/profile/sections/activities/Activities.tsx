import React from 'react';
import style from './activities.module.css';

interface ActivitiesProps {

}

const Activities: React.FC<ActivitiesProps> = ({}) => {
    return (
        <div className={style['activities']}>
            <div className={`profile-section-title`}>
                <h3>Activities</h3>
            </div>
            <div className={`profile-section-content`}>
                <p>Coming Soon</p>
            </div>
        </div>
    );
};

export default Activities;