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
    const {picturePath: src, width, height} = picture || {src: '', alt: '', width: 0, height: 0};
    const {setContent, setShow} = usePictureModal();
    const handleClick = (src:string, alt:string, width: number, height:number) => {
        setContent({src, alt, width, height});
        setShow(true);
    }
    return   loading?
            (<div className={style['loading']}>
            </div>)
            :
            (<div onClick={()=>{
            handleClick(src as string, alt, width, height);
                }}className={`${style['picture-component']} `}>
                <Image width={width} height={height} src={src!} alt={alt} />
            </div>)
    ;
};

export default PictureComponent;