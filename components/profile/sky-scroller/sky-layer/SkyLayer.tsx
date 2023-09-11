import React, { useEffect, useState } from 'react';
import style from './sky-layer.module.css';
import Cloud  from '../cloud/Cloud';
import { ca } from 'date-fns/locale';
interface SkyLayerProps {
    styles: React.CSSProperties;
    boxSize: number;
}

const SkyLayer: React.FC<SkyLayerProps> = ({styles, boxSize}) => {
    const [cloudNo, setCloudNo] = useState(0);
    const numberOfBoxesOnScreen = (boxSize: number) => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const boxPerRow = Math.ceil(windowHeight / boxSize);
        const boxPerColumn = Math.ceil(windowWidth / boxSize);
        return boxPerColumn * boxPerRow;
    }
    const calculateClouds = () => {
        const cloudsNo = numberOfBoxesOnScreen(boxSize);
        setCloudNo(cloudsNo);
    }
    
    const fillWithClouds = () => {
        const clouds:React.ReactNode[] = [];
        const variations = [1,2,3,4,5];
        const noOFVarations = variations.length;
        for(let i = 0; i < cloudNo; i++){
            const width = (boxSize / 3) + Math.floor(Math.random() * (boxSize / 2));
            const height = (boxSize / 3) + Math.floor(Math.random() * (boxSize / 2));
            const left = (Math.random() * (boxSize - width) )
            const top = (Math.random() * (boxSize - height) )
            const variation = variations[Math.floor(Math.random() * noOFVarations)];
            const style = {
                transform: `translate(${left}px, ${top}px)`,
            } as React.CSSProperties;
            clouds.push(
                <Cloud
                    key={i}
                    variation={variation}
                    style={style}
                    width={width}
                    height={height}
                    />
                )

        }
        return clouds;
    }
    
    useEffect(()=>{
        window.addEventListener('resize', calculateClouds);
        calculateClouds();
        return () => {
            window.removeEventListener('resize', calculateClouds);
        }
    },[])
    return (
        <div style={styles} className={style['sky-layer']}>
            {fillWithClouds()}
        </div>
    );
};

export default SkyLayer;