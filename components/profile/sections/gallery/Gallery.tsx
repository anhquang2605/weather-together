import React, { useEffect, useRef, useState } from 'react';
import style from './gallery.module.css';
import { Picture } from '../../../../types/Picture';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import { PictureModalProvider } from '../../../embedded-view-components/picture-component/PictureModalContext';
import PictureComponent from '../../../embedded-view-components/picture-component/PictureComponent';
import PictureModal from '../../../embedded-view-components/picture-component/picture-modal/PictureModal';

interface GalleryProps {
    username: string;
}
const MAX_PICTURES = 3;
const MAX_ASPECT_RATIO_OVER = 0.05; // 5% width is allowed to strech compare to original width
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
    const generatePictures = (pics: Picture[],totalWidth: number = 0) => {
        let backbones: JSX.Element[] = [];
        
        for(let i = 0; i < pics.length; i++){
            const thePicture = pics[i];
            if (!thePicture) continue;
            const pWidth = thePicture.width ?? 0;
            const pHeight = thePicture.height ?? 0;
            const aspectRatio = pWidth / pHeight;

            backbones.push(
                <div className={style['gallery-picture']}  key={i}>
                    <PictureComponent
                        key={i}
                        picture={thePicture}
                        alt=''
                        loading={false}
                        pictures={pics}
                        variant='noSpecialStyle'
                    />
                </div>
            )
        }
        return backbones;
    }
    const resizeObserverHandler = (entries: ResizeObserverEntry[]) => {
        const len = entries.length;
        const entry = entries[0];
        if(!entry) return;
        const {width} = entry.contentRect;
        const pics = [...pictures];
        generatePictures(pics, width);
    }
    const getPerfectHeightForRow = (width: number, pics: Picture[]) => {
        //get perfect height for this row given the current pictures that would be populated on this row
        let height = 0;
    }
        //TODO: IMAGE arrangement
    /*
        align like google search:
        - each row will have fixed height
        - each row also have equal width (preferably full of the container's width)
        - fill picture on row as much as possible but maintain the aspect ratio and keep the row width maximum
        - for the last row, leave some space at the end
        - there must be a threshold for the last item in the row so that break to new row will happen, accepted percentage is 5% or below
        - Since we only streching width, compare new width with original width to determine the threshold.
        - we check each image to make sure that we can fix them on to the row:
            + If there is still space on the row, image remain the aspect ratio
            + check the remain space with the upcoming width,
                + Yes, then add image to the row
                + No, we need to strech each image (including new one) to fit this one in the row. check if any of them break the threshold
                    + Yes, then we break the row and create a new one
                    + No, then we add image to the row
                    + this logic can be handled using flex of css instead of javascript, we just need to scale image and check if it break the threshold
        _ Using the resize observer, same function that check the threshold
        _ Is there a css way to strech image width?
            + Flex-grow - how much the item can grow in the flex container, flex-basis (initial width of the flex item), dont use this, since our images width is dynamic adjusted using javascript ** NOT VIABLE **
            + Aspect-ratio: might be equivalent to fixed width and height when either of these dimension are fixed
               + let the container strech the gap in between the images
            + Just use javascript: costly. last resource. But can be improved:
                + how about having a wrapper that would center the image within the container? might obstruct important part of the image, new algorithm is needed (we might need to create an component to handle just that, the component would also provide how much width and height was obstructed)
                + providing fixed aspect ratio with the above the approach so that user can expect the image to have the same aspect ratio. (this is fixed dimension approach, so it is not possible)
                + this approach does not require costly operation, each component independently stretches the image to certain.
                + we strech the container while centering the picture component.

    */
    useEffect(() => {
        fetchPictures();
        const observer = new ResizeObserver(resizeObserverHandler);
        const target = document.querySelector(`.${style['gallery-pictures']}`);
        if(target){
            observer.observe(target);
        }
        return () => {
            if(target){
                observer.unobserve(target);
            }
        }
    },[])
    return (
    <PictureModalProvider>
        <div className={`${style['gallery']} profile-section`}>
            <div className={`profile-section-title`}>
                <h3>Gallery</h3>
            </div>
            <div className={`profile-section-content ${style['gallery-pictures']}`}>
                {pictures && pictures.length > 0 && generatePictures(pictures)}
                {morePictures && <span className={style['gallery-view-more']} onClick={fetchPictures}>View More</span>}
            </div>

        </div>
        <PictureModal/>
    </PictureModalProvider>
    );
};

export default Gallery