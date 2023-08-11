import React from 'react';
import { PictureModalProvider } from './picture-component/PictureModalContext';
import PictureComponent from './picture-component/PictureComponent';
interface PitcuterModalGroupProps {
    src: string;
    alt: string;
    ratio: number;
    width: number;
    height: number;
    clickable?: boolean;
}

const PitcuterModalGroup: React.FC<PitcuterModalGroupProps> = ({
    src,
    alt,
    ratio,
    width,
    height,
    clickable,
}) => {
    return (
        <PictureModalProvider>
            <PictureComponent 
                src={src}
                alt={alt}
                ratio={ratio}
                width={width}
                height={height}
                clickable={clickable ?? false}
            />
        </PictureModalProvider>

    );
};

export default PitcuterModalGroup;