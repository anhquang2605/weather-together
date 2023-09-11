import React, { CSSProperties, ReactElement, ReactNode } from 'react';
import style from './sky-scroller.module.scss';
import SkyLayer from './sky-layer/SkyLayer';
interface SkyScrollerProps {
    layersNumber: number;
    followMouse?: boolean;
    boxSize?: number;
    gapBetweenBoxes?: number;
    skyClassName?: string;//style is controlled by the user
    cloudClassName?: string; //style is controlled by the user
    profileDimension?: {
        width: number;
        height: number;
    }
}
interface LayerStyle {
    width: string;
    height: string;
    position: string;
    top: number;
    left: number;
    transform: string;
    transformOrigin: string;
    zIndex: number;
    filter: string;
}
const SkyScroller: React.FC<SkyScrollerProps> = ({
    layersNumber,
    followMouse = false,
    boxSize=150,
    gapBetweenBoxes = 0,
    skyClassName='',
    cloudClassName='',
    profileDimension = {
        width: 0,
        height: 0,
    }
}) => {
const BLUR = 3;
    const generateStyle = (dimensionOrder: number, blur:number = 0) => {
            const scaleMultiplier = 0.75;
            return {
                display: 'flex',
                width: '100%',
                height: '100%',
                flexDirection: 'row',
                flexWrap: 'wrap',
                position: 'absolute',
                top: 0,
                left: 0,
                transformOrigin: 'center',
                zIndex: dimensionOrder * 1,
                gap: `${gapBetweenBoxes}px`,
                opacity: (1/layersNumber) + (dimensionOrder * (1/layersNumber)),
                transform: `scale(${0.5+ (scaleMultiplier * dimensionOrder)})`,
            } as CSSProperties
        }
    const generateLayers = (layersNumber: number) => {
        const layers:ReactNode[] = [];
        for(let i = 0; i < layersNumber; i++){
            let layerStyle;
            if(i === layersNumber - 1){
                layerStyle = generateStyle(i + 1, BLUR);
            }else{
                layerStyle = generateStyle(i + 1);
            }
            layers.push(
                <SkyLayer
                    profileDimension={profileDimension}
                    key={i}
                    styles={layerStyle}
                    boxSize={boxSize +  (i * 50)}
                />
            )
        }
        return layers;
    }
    return (
        <div className={style['sky-scroller']} style={
            {
                height: profileDimension.height,
            }
        }>

                {generateLayers(layersNumber)}

        </div>
    );
};

export default SkyScroller;