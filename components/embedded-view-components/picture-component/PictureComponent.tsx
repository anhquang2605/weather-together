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
    return (    
        <PictureModalProvider>
            <div className={styles['picture-component']}>
                <Image width={width} height={height} src={src} alt={alt} fill  />
            </div>
        </PictureModalProvider>
    );
};

export default PictureComponent;