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
    boxSize=300,
    gapBetweenBoxes = 0,
    skyClassName='',
    cloudClassName='',
}) => {
const BLUR = 3;
    const generateStyle = (dimensionOrder: number, blur:number = 0) => {
            const scaleMultiplier = 1;
            return {
                display: 'grid',
                width: '100%',
                height: '100%',
                gridTemplateColumns: `repeat(auto-fill, ${boxSize +  (dimensionOrder * 100)}px)`,
                gridTemplateRows: `repeat(auto-fill, ${boxSize + (dimensionOrder * 100)}px)`,
                position: 'absolute',
                top: 0,
                left: 0,
                transformOrigin: 'center',
                zIndex: dimensionOrder * 5,
                filter: `blur(${blur}px)`,
                gap: `${gapBetweenBoxes}px`,
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
                    styles={layerStyle}
                    boxSize={boxSize}
                />
            )
        }
        return layers;
    }
    return (
        <div className={style['sky-scroller']}>
            <div className={style['sky']}>
                {generateLayers(layersNumber)}
            </div>
        </div>
    );
};

export default SkyScroller;