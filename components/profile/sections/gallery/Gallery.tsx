import React, { useEffect, useRef, useState } from 'react';
import style from './gallery.module.css';
import { Picture } from '../../../../types/Picture';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import { PictureModalProvider } from '../../../embedded-view-components/picture-component/PictureModalContext';
import PictureComponent from '../../../embedded-view-components/picture-component/PictureComponent';
import PictureModal from '../../../embedded-view-components/picture-component/picture-modal/PictureModal';
import LoadingIcon from '../../../plugins/loading-icon/LoadingIcon';

interface GalleryProps {
    username: string;
}
const MAX_PICTURES = 12;
const MAX_ASPECT_RATIO_OVER = 0.05; // 5% width is allowed to strech compare to original width
const Gallery: React.FC<GalleryProps> = ({username}) => {
    const [pictures, setPictures] = useState<Picture[]>([]);
    const [pageNo, setPageNo] = useState<number>(1);
    const [picturesComponents, setPicturesComponents] = useState<JSX.Element[]>([]);
    const [morePictures, setMorePictures] = useState<boolean>(false);
    const [fetchPictureStatus, setFetchPictureStatus] = useState<string>('idle');
    const fetchPictures = (pageNo: number) => {
        setFetchPictureStatus('loading');
        //fetch pictures using username, sorted by created date, also need count of pictures, limit to 10, when need view more, will make user go to pop up gallery, pop up gallery is already implemented, check post for reference
        console.log(pageNo);
        const params = {
            username: username,
            amount: MAX_PICTURES,
            page: pageNo
        }
        const endpoint = 'pictures';
        const result = fetchFromGetAPI(endpoint, params);
        result.then(res => {
            if(res.success){
                setFetchPictureStatus('success');
                setPictures( prev => [...prev, ...res.data]);
                setMorePictures(res.more);
                setPageNo(prev => prev + 1);
            } else {
                setFetchPictureStatus('error');
                setPictures([]);
            }
        })
    }
    const resizeObserverHandler = (entries: ResizeObserverEntry[]) => {
        const entry = entries[0];
        if(!entry) return;
        const {width} = entry.contentRect;
        //get min-height of the entry
        const target = entry.target as HTMLDivElement;
        if(!target) return;
        //we use min-height to determine the height of the row, this is depend on the css variables in gallery.module.css
        const computedStyle = getComputedStyle(target);
        const rowHeight = parseFloat(computedStyle.getPropertyValue('min-height').replace('px', ''));
        const padding = parseFloat(computedStyle.getPropertyValue('padding').replace('px', ''));
        const gap = parseFloat(computedStyle.getPropertyValue('gap').replace('px', ''));
        const remaingWidth = width - (padding * 2);
        const pics = [...pictures];
        const newPicturesComponents = generatePictures(pics, remaingWidth, rowHeight, gap);
        setPicturesComponents(newPicturesComponents);
    }
    const generatePictures = (pics: Picture[],totalWidth: number = 0, rowHeight: number, gap: number) => {
        let backbones: JSX.Element[] = [];
        for(let i = 0; i < pics.length; i++){
            const thePicture = pics[i];
            if (!thePicture) continue;
            backbones.push(
                <div className={style['gallery-picture']}     key={i}>
                    <PictureComponent
                        isBackground = {true}
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
                + collect gap as well as the padding properties of the container to determine the remaining space.
                + picture is set to be background image, so that it can strech and centalized. This work nicely, still need to figure out how to set width for each picture so that it fill up the space.
                + how do we determine the width of each image and fill the row?
                    + working on fill algorithm

    */
    useEffect(() => {
        fetchPictures(pageNo);
    },[])
    useEffect(()=>{
        if(pictures.length > 0){
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
        }
    },[pictures])
    return (
    <PictureModalProvider>
        <div className={`${style['gallery']} profile-section`}>
            <div className={`profile-section-title`}>
                <h3>Gallery</h3>
            </div>
            <div className={`profile-section-content `}>
                <div className={`${style['gallery-pictures']}`}>
                {
                    pictures.length <= 0 ?
                    <div className={style['gallery-no-pictures']}>
                        <p>No pictures yet</p>
                    </div>
                    :
                    <>
                        {picturesComponents}
                        {morePictures &&
                        <div className={`${style['view-more-container']} ${
                            fetchPictureStatus === 'loading' ? style['loading'] : ''
                        }`}>
                             <span className={`action-btn ${style['gallery-view-more']} `} onClick={()=>{fetchPictures(pageNo)}}>
                                {fetchPictureStatus === 'loading' ? 
                                <div className={`${style['loading-btn-content']}`}>
                                    <LoadingIcon/>
                                    Getting more...
                                    
                                </div>: 
                                'View More'}
                                </span>
                        </div>
                        }
                    </>   
                }
                </div>
                
            </div>

        </div>
        <PictureModal/>
    </PictureModalProvider>
    );
};

export default Gallery