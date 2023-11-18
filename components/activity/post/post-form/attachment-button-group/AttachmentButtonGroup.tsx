import {useState, useEffect, use} from 'react'
import {IoImages, IoPricetags} from 'react-icons/io5'
import style from './attachment-button-group.module.css'
import ShareWeatherButton from './share-weather-button/share-weather-button';
import { useViewSliderContext } from '../../../../plugins/view-slider/useViewSliderContext';
interface AttachmentButtonGroupProps {
    setRevealImageAttachForm: React.Dispatch<React.SetStateAction<boolean>>;
    attachedImagesLength: number;
    taggedUsernamesLength: number;
    setCurrentWeather: React.Dispatch<React.SetStateAction<any>>;
    taggedUsernames?: string[];
}
export default function AttachmentButtonGroup({setRevealImageAttachForm, taggedUsernamesLength, attachedImagesLength, setCurrentWeather, taggedUsernames}: AttachmentButtonGroupProps) {
    const setActiveSlide = useViewSliderContext().setActiveSlide;
    return (
        <div className={`${style["attachment-btn-group"]} mb-4`}>
            <span className={`${style.description}`}>
                Attach to this post:
            </span>
            <button 
                className={`
                    ${style['attachment-btn']} 
                    ${style['image-btn']} 
                    ${attachedImagesLength > 0 ? style['attached'] : ''}
                    `} 
                
                onClick={()=>{setRevealImageAttachForm( (prevState:boolean) => !prevState)}}
            >
                <IoImages className="icon"/>
                {attachedImagesLength > 0 &&<span className={style["number-badge"]}>
                    {attachedImagesLength}
                </span>}
                Images
            </button>
            <button className={`
                ${style['attachment-btn']} 
                ${style['tag-btn']}
                ${taggedUsernamesLength ? style['attached'] : ''}
                `}
                    onClick={
                        () => {
                            setActiveSlide(1);
                        }
                    }
                >
                <IoPricetags className="icon"/>
                {taggedUsernamesLength ? `${taggedUsernamesLength} Tag${taggedUsernamesLength > 1 ? 's' : ""} ` :"Friends Tags"}
            </button>
            <ShareWeatherButton setCurrentWeather={setCurrentWeather} />
        </div>
    )
}