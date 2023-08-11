import React from 'react';
import style from './picture-modal.module.css';
import Image from 'next/image';
import {usePictureModal} from '../PictureModalContext';
import { IoClose } from 'react-icons/io5';

const PictureModal: React.FC = () => {
    const {content, show, setShow} = usePictureModal();
    if(content === null || !show){
        return null;
    }
    const {src, alt, width, height} = content;// content is null when the modal is closed
    
    return (
        <div className={style['picture-modal']}>
            <div className={`glass-dark ${style['modal-background']}`}>
            </div>
            <div className={style['modal-content']}>
                <button className={style['close-btn']}>
                    <IoClose />
                </button>
                <Image src={src} alt={alt} width={width} height={height} />
            </div>
        </div>
    );
};

export default PictureModal;