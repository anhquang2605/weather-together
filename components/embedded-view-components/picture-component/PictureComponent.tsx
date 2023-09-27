import React from 'react';
import style from './picture-component.module.css';
import Image from 'next/image';
import {usePictureModal } from './PictureModalContext';
import { Picture } from '../../../types/Picture';
interface PictureComponentProps {
    picture: Picture | null;
    loading: boolean;
    alt: string;
}

const PictureComponent: React.FC<PictureComponentProps> = ({
    picture,
    loading,
    alt,
}) => {
    const {picturePath: src, width = 200, height = 100, username, _id} = picture || {src: '', alt: '', width: 0, height: 0};
    const {setContent, setShow} = usePictureModal();
    const handleClick = (src:string, alt:string, width: number, height:number) => {
        setContent({src, alt, width, height, author: username || "", _id: _id || "" });
        setShow(true);
    }
    return (
        <div className={style["picture-component"]}>
            {loading?
            <div className={style['picture'] + " " +  style['loading']}>
            </div>
            :
            <div onClick={()=>{
            handleClick(src as string, alt, width || 0, height || 0);
                }}className={`${style['picture']} `}>
                <Image width={width} height={height}  src={src!} alt={alt} />
            </div>}
        </div>
    )    
    ;
};

export default PictureComponent;