import React from 'react';
import style from './about-me.module.css';

interface AboutMeProps {

}

const AboutMe: React.FC<AboutMeProps> = ({}) => {
    return (
        <div className={style['about-me']}>
            <div className={`profile-section-title`}>
                <h3>About Me</h3>
            </div>
            
        </div>
    );
};

export default AboutMe;