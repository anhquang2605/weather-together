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
}

const SkyLayer: React.FC<SkyLayerProps> = ({styles, boxSize, profileDimension}) => {
    const [clouds, setClouds] = useState<React.ReactElement[]>([]);
    const sizeVariantionMultiplier = 3;
    const layerRef = React.createRef<HTMLDivElement>();


    
    const fillWithClouds = () => {
        var noOfVariations = 10;
        var i = 0;
        var curWidth = 0;
        var curHeight = 0;
        var curMaxHeight = 0;
        var curEleOnRow = 0;
        const clouds:React.ReactElement[] = [];
        while(curHeight < profileDimension.height && curWidth < profileDimension.width){
            const sizeOfBox = boxSize * ( (Math.random() * (sizeVariantionMultiplier - 0.5))  + 0.5) ; // from 0.5 to max
           
            curWidth += sizeOfBox;
           
            if (curWidth > profileDimension.width){
                console.log("curWidth", curWidth, "- profileDimension.width", profileDimension.width);
                curWidth = sizeOfBox;
                curHeight += sizeOfBox;
                curMaxHeight = 0;
                curEleOnRow = 0;
            }
            console.log(curHeight, profileDimension.height);
            curMaxHeight = Math.max(curMaxHeight, sizeOfBox);
/*             const left = (Math.random() * (sizeOfBox - width) )
            const top = (Math.random() * (sizeOfBox - height) ) */
            const left = Math.random() * sizeOfBox - Math.random()* sizeOfBox;
            const top = Math.random() * sizeOfBox - Math.random()* sizeOfBox;
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
                />
            )
            i++;
            curEleOnRow += 1;
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
        <div style={styles} ref={layerRef} className={style['sky-layer']}>
            {clouds}
        </div>
    );
};

export default SkyLayer;