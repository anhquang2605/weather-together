import React, { CSSProperties, ReactElement, ReactNode, useEffect } from 'react';
import style from './sky-scroller.module.scss';
import SkyLayer from './sky-layer/SkyLayer';
interface SkyScrollerProps {
    layersNumber: number;
    followMouse?: boolean;
    boxSize?: number;
    gapBetweenBoxes?: number;
    skyClassName: string;//style is controlled by the user
    cloudClassName: string; //style is controlled by the user
    profileDimension?: {
        width: number;
        height: number;
    }
    parentClassName: string;
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
    boxSize=0.15,
    gapBetweenBoxes = 0,
    skyClassName='',
    cloudClassName='',
    profileDimension = {
        width: 0,
        height: 0,
    },
    parentClassName,
}) => {
const BLUR = 0;
const scaleMultiplier = 0.3;
const startingOpacity = 0.3;
    const generateStyle = (dimensionOrder: number, blur:number = 0) => {
            
            return {
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                flexWrap: 'wrap',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: dimensionOrder * 1,
                gap: `${gapBetweenBoxes}px`,
                opacity: startingOpacity + ((dimensionOrder - 1) * ((1-startingOpacity) / (layersNumber - 1))),
                filter: `blur(${blur}px)`,

            } as CSSProperties
        }
    const generateLayers = (layersNumber: number) => {
        const layers:ReactNode[] = [];
        const window = global.window;
        let screensizeMultiplier = 1;
        //if window width is less than window height
        if(window){
            if(window.innerWidth < 600){
                screensizeMultiplier = 0.6;    
            }
        }
        for(let i = 0; i < layersNumber; i++){
            let layerStyle;
            if(i === layersNumber - 1){
                layerStyle = generateStyle(i + 1, BLUR);
            }else{
                layerStyle = generateStyle(i + 1);
            }
            layers.push(
                <SkyLayer
                    className={style[`sky-layer-${i}`]}
                    cloudClassName={cloudClassName}
                    profileDimension={profileDimension}
                    key={i}
                    styles={layerStyle}
                    boxSize={boxSize * (profileDimension.width) +  (i * 50)}
                    order={i}
                    scale={(scaleMultiplier * i) +  1 * screensizeMultiplier}
                    last={i === layersNumber - 1}
                />
            )
        }
        return layers;
    }
   
    useEffect(()=>{
        const parent = document.querySelector(`.${parentClassName}`) as HTMLDivElement;

        const handleScroll = () => {
            const parentScrollTop = parent.scrollTop;
            for (let i = 0; i < layersNumber; i++) {
                const layer = document.querySelector(`.${style[`sky-layer-${i}`]}`) as HTMLDivElement;
                const speed = (i + 1) / layersNumber ;
                layer.style.transform = `translateY(${-parentScrollTop * speed}px)`; 
            }
        }
        parent.addEventListener('scroll', handleScroll);
        return () => {
            parent.removeEventListener('scroll', handleScroll);
        }
    },[layersNumber])
    return (
        <div style={{
            height: `${profileDimension.height}px`,
        }} className={`${style['sky-scroller']} ${skyClassName}`}>

                {generateLayers(layersNumber)}

        </div>
    );
};

export default SkyScroller;