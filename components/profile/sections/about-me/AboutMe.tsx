import React from 'react';
import style from './about-me.module.css';

interface AboutMeProps {

}

const AboutMe: React.FC<AboutMeProps> = ({}) => {
    return (
        <div className={`${style['about-me']} profile-section profile-section-right`}>
            <div className={`profile-section-title`}>
                <h3>About Me</h3>
            </div>
            <div className={`profile-section-content big-boy`}>
            Chickens are domesticated birds that have been raised for thousands of years for their meat, eggs, and feathers. They are descendants of wild junglefowl from Southeast Asia and have been selectively bred into various breeds with diverse characteristics. Chickens are social animals that live in flocks and have a well-defined pecking order, which determines their social hierarchy. They communicate through a variety of vocalizations and body language. Chickens are omnivores, eating a diet of seeds, insects, and small animals. They play an essential role in agriculture, providing a sustainable source of protein through their eggs and meat.
            </div>
        </div>
    );
};

export default AboutMe;