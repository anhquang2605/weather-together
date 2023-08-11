import React from 'react';
import styles from './picture-component.module.css';
import Image from 'next/image';
import { PictureModalProvider, usePictureModal } from './PictureModalContext';
interface PictureComponentProps {
    src: string;
    alt: string;
    ratio: number;
    width: number;
    height: number;
    clickable?: boolean;
}

const PictureComponent: React.FC<PictureComponentProps> = ({
    src,
    alt,
    ratio,
    width,
    height,
}) => {
    const {setContent, setShow} = usePictureModal();
    const handleClick = (src:string, alt:string, width: number, height:number) => {
        setContent({src, alt, width, height});
        setShow(true);
    }
    return (    
        <div onClick={()=>{
            handleClick(src, alt, width, height);
        }}className={`${styles['picture-component']} `}>
            <Image width={width} height={height} src={src} alt={alt} />
        </div>
    );
};

export default PictureComponent;