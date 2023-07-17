import {useState, useEffect} from 'react'
import {IoImages, IoPricetags} from 'react-icons/io5'
import style from './attachment-button-group.module.css'
interface AttachmentButtonGroupProps {
    setRevealImageAttachForm: React.Dispatch<React.SetStateAction<boolean>>;
    attachedImagesLength: number;
    taggedUsernamesLength: number;
}
export default function AttachmentButtonGroup({setRevealImageAttachForm, taggedUsernamesLength, attachedImagesLength}: AttachmentButtonGroupProps) {
    return (
        <div className={`${style["attachment-btn-group"]} mb-4`}>
            <span className={`${style.description}`}>
                Attach to your posts:
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
                `}>
                <IoPricetags className="icon"/>
                Friends Tags
            </button>
        </div>
    )
}