import React from 'react';
import style from './about-me.module.css';
import { User } from '../../../../types/User';
import Summary from '../../summary/Summary';
import Bio from '../bio/Bio';

interface AboutMeProps {
    user: User
}

const AboutMe: React.FC<AboutMeProps> = ({user}) => {
    return (
        <div className={`${style['about-me']} profile-section profile-section-left`}>
            <div className={`profile-section-title`}>
                <h3>About Me</h3>
            </div>
            <div className={style['about-me-content']}>
                <div className={`profile-section-content`}>
                    <Summary    user={user} isEditing={false} />

                </div>
                <Bio isEditing={false} userBio={user.bio || ""} />
            </div>

        </div>
    );
};

export default AboutMe;