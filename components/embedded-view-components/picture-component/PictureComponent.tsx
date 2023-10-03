import React from 'react';
import style from './picture-component.module.css';
import Image from 'next/image';
import {usePictureModal } from './PictureModalContext';
import { Picture } from '../../../types/Picture';
interface PictureComponentProps {
    picture: Picture;
    loading: boolean;
    alt: string;
    pictures?: Picture[];
    variant?: "freeStyle";
    children?: React.ReactNode;
}

const PictureComponent: React.FC<PictureComponentProps> = ({
    picture,
    loading,
    alt,
    pictures,
    variant = "",
    children
}) => {

    const {setContent, setShow, setCurrentPictureIndex, setPictures} = usePictureModal();
    const handleClick = (picture: Picture) => {
        setContent(picture);
        
        setShow(true);
        if(pictures){
            setPictures(pictures);
            setCurrentPictureIndex(pictures.findIndex(p => p._id === picture._id));
        }
    }
    return (
        <div className={`${style["picture-component"]} ${style[variant]} `} 
            onClick={()=>{
                handleClick(picture);
            }}
        >
            {children}
            {picture && <Image width={picture.width} height={picture.height}  src={picture.picturePath} alt={alt} />}
        </div>
    )    
    ;
};

export default PictureComponent;