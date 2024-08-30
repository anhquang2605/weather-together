import React from 'react';
import style from './gallery.module.css';

interface GalleryProps {

}

const Gallery: React.FC<GalleryProps> = ({}) => {
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