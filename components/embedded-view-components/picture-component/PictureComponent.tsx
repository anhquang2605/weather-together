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
    key?: number;
}

const PictureComponent: React.FC<PictureComponentProps> = ({
    picture,
    loading,
    alt,
    key,
    pictures
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
        <div className={style["picture-component"]}>
            {loading?
            <div className={style['picture'] + " " +  style['loading']}>
            </div>
            :
            <div onClick={()=>{
            handleClick(picture);
                }}className={`${style['picture']} `}>
                {
                    picture && <Image width={picture.width} height={picture.height}  src={picture.picturePath} alt={alt} />
                }

            </div>}
        </div>
    )    
    ;
};

export default PictureComponent;