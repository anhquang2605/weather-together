import React from 'react';
import style from './gallery.module.css';

interface GalleryProps {
    username: string;
}

const Gallery: React.FC<GalleryProps> = ({username}) => {
    const fetchPictures = () => {
        //fetch pictures using username, sorted by created date, also need count of pictures, limit to 10, when need view more, will make user go to pop up gallery, pop up gallery is already implemented, check post for reference
    }
    return (
        <div className={`${style['gallery']} profile-section`}>
            <div className={`profile-section-title`}>
                <h3>Gallery</h3>
            </div>
            <div className={`profile-section-content`}>
                <p>Coming Soon</p>
            </div>
        </div>
    );
};

export default Gallery;