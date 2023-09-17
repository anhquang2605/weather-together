import React, { useEffect } from 'react';
import style from './animated-banner.module.scss';

interface AnimatedBannerProps {
    text: string;
    flagClassName?: string;
    textClassName?: string;
    bannerWidth?: number;
    bannerHeight?: number;
}

const AnimatedBanner: React.FC<AnimatedBannerProps> = (props) => {
    const { text, flagClassName = "", textClassName = "", bannerWidth, bannerHeight } = props;

    const handleSpawnBars = () => {
        let characters = text.split("").map(char => `<span>${char}</span>`).join("");``
        let delay = 0;
        const increment1 = 0.05; // delay increment in seconds
        const textContainer = document.getElementById(style["text-container"]);
       
        const flag = document.getElementById(style["flag"]);
        if(textContainer)
            textContainer.innerHTML = characters;
            document.querySelectorAll(`#${style['text-container']} span`).forEach(span => {
                const element = span as HTMLElement;
                const width = element.getBoundingClientRect().width;
                element.style.animationDelay = `${delay}s`;
                delay += increment1;
            });
        if(flag){
            let delay2 = 0;
            const increment2 = increment1 /20 ;
            const animatedBanner = document.getElementById(style["animated-banner"]);
            const totalWidth = bannerWidth ? bannerWidth : animatedBanner?.getBoundingClientRect().width || 0;
            for(let i = 0; i < totalWidth; i++){
                const element = document.createElement("div");
                element.classList.add(style["bar"]);
                element.style.animationDelay = `${delay2}s`;
                delay2 += increment2;
                flag.appendChild(element);
            }
        }
    }
    useEffect(() => {
        handleSpawnBars();
    }, []);
    return (
        <div id={style['animated-banner']} style={{
            width: bannerWidth ? `${bannerWidth}px` : 'auto',
            height: bannerHeight ? `${bannerHeight}px` : 'auto'
        }}>
            <div id={style['flag']} className={`${flagClassName}`}>

            </div>
            <div  id={style['text-container']} className={`${textClassName}`}>

            </div>
        </div>
    );
};

export default AnimatedBanner;