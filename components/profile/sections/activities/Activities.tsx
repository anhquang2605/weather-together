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
            
        </div>
    );
};

export default Activities;