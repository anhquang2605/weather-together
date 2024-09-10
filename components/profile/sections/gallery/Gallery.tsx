import React, { useEffect, useState } from 'react';
import style from './gallery.module.css';
import { Picture } from '../../../../types/Picture';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import { PictureModalProvider } from '../../../embedded-view-components/picture-component/PictureModalContext';
import PictureComponent from '../../../embedded-view-components/picture-component/PictureComponent';
import PictureModal from '../../../embedded-view-components/picture-component/picture-modal/PictureModal';

interface GalleryProps {
    username: string;
}
const MAX_PICTURES = 10;
const Gallery: React.FC<GalleryProps> = ({username}) => {
    const [pictures, setPictures] = useState<Picture[]>([]);
    const [morePictures, setMorePictures] = useState<boolean>(false);
    const fetchPictures = () => {
        //fetch pictures using username, sorted by created date, also need count of pictures, limit to 10, when need view more, will make user go to pop up gallery, pop up gallery is already implemented, check post for reference
        const params = {
            username: username,
            amount: MAX_PICTURES,
        }
        const endpoint = 'pictures';
        const result = fetchFromGetAPI(endpoint, params);
        result.then(res => {
            if(res.success){
                setPictures(res.data);
                setMorePictures(res.more);
            } else {
                setPictures([]);
            }
        })
    }
    const generatePictures = () => {
        let backbones: JSX.Element[] = [];
        for(let i = 0; i < pictures.length; i++){
            backbones.push(
                <PictureComponent
                    key={i}
                    picture={pictures[i]}
                    alt=''
                    loading={false}
                    pictures={pictures}
                    variant=''
                />
            )
        }
        return backbones;
    }
    useEffect(() => {
        fetchPictures();
    },[])
    //TODO: IMAGE arrangement
    /*
        align like google search:
        - each row will have fixed height
        - each row also have equal width
        - fill picture on row as much as possible but maintain the aspect ratio and keep the row width maximum
        - for the last row, leave some space at the end
        - 
    */
    return (
    <PictureModalProvider>
        <div className={`${style['gallery']} profile-section`}>
            <div className={`profile-section-title`}>
                <h3>Gallery</h3>
            </div>
            <div className={`profile-section-content ${style['gallery-pictures']}`}>
                {pictures && pictures.length > 0 && generatePictures()}
            </div>
        </div>
        <PictureModal/>
    </PictureModalProvider>
    );
};

export default Gallery