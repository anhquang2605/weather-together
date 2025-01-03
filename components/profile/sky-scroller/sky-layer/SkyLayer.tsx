import React, { useEffect, useState } from 'react';
import style from './sky-layer.module.css';
import Cloud  from '../cloud/Cloud';
import { ca } from 'date-fns/locale';
import { size } from 'lodash';
import { profile } from 'console';
interface SkyLayerProps {
    styles: React.CSSProperties;
    boxSize: number;
    profileDimension: {
        width: number;
        height: number;
    }
    cloudClassName: string;
    className: string;
    order: number;
    scale: number;
    last: boolean;
}

const SkyLayer: React.FC<SkyLayerProps> = ({styles, boxSize, profileDimension, cloudClassName, className, scale, order, last}) => {
    const [clouds, setClouds] = useState<React.ReactElement[]>([]);
    const sizeVariantionMultiplier = 3;
    const layerRef = React.createRef<HTMLDivElement>();
    const fillWithClouds = () => {
        var noOfVariations = 5;
        if(last){
            noOfVariations = 5;
        }
        var i = 0;
        var curWidth = 0;
        var curHeight = 0;
        var curMaxHeight = 0;
        var curEleOnRow = 0;
        var dimHeight = (profileDimension.height* 1.2);
        var dimWidth = profileDimension.width;
        const clouds:React.ReactElement[] = [];
        while(curHeight <= dimHeight){
            const sizeOfBox = boxSize * ( (Math.random() * (sizeVariantionMultiplier))  + 0.5) ; // from 0.5 to max
           
            
            if (curWidth > profileDimension.width){
                curWidth = sizeOfBox;

                curHeight += curMaxHeight;
                
                curMaxHeight = 0;
                curEleOnRow = 1;

            }else{
                curWidth += sizeOfBox;
                curEleOnRow += 1;
            }
            curMaxHeight = Math.max(curMaxHeight, sizeOfBox);
/*             const left = (Math.random() * (sizeOfBox - width) )
            const top = (Math.random() * (sizeOfBox - height) ) */
            const allowedWidth = sizeOfBox ;
            const allowedHeight = sizeOfBox / 2 ;
            const left = (Math.random() * allowedWidth)
            const top = (Math.random() * allowedHeight) - (allowedHeight / 2)  ;
            const variation = Math.floor((Math.random() * noOfVariations + 1));

            const style = {
                transform: `translate(${left}px, ${top}px)`,
            } as React.CSSProperties;

            clouds.push(
                <Cloud
                key={i}
                variation={variation}
                style={style}
                boxSize={sizeOfBox}
                index={i}
                cloudClassName={cloudClassName}
                scale ={scale}
                />
            )
            i++;

        }
        if(curEleOnRow === 1){
            clouds.pop();
        }
        setClouds(clouds);
    }
    
    useEffect(() => {
        if(profileDimension.width > 0 && profileDimension.height > 0){
            fillWithClouds();
        }
    }, [profileDimension]);
    return (
        <div className={className} style={styles} ref={layerRef}>
            {clouds}
        </div>
    );
};

export default SkyLayer;