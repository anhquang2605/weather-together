import React, { use, useEffect } from 'react';
import styles from './cloudy.module.css';
import anime from 'animejs';
import { pathRevealAnimation, pathShrinkAnimation, propertiesStagesAnimation } from '../../../../libs/anime-animations-helpers';
import { resourceUsage } from 'process';

interface CloudyProps {

}

const Cloudy: React.FC<CloudyProps> = ({}) => {
    const startAnimation = () => {
        //animation constants
        const CLOUD_STROKE_DURATION = 700;
        const CLOUD_EXPAND_DURATION = 1000;
        const RAIN_DURATION = 500;
        //timeline set up
        const timeline = anime.timeline({});
        //cloud expand animation
        const cloudExpandAnimation: any = propertiesStagesAnimation(`.${styles["cloudy-circle"]}`, 'easeInExpo', CLOUD_EXPAND_DURATION, {
            scale: [0, 3],
            delay: anime.stagger(200, {from: 'center'})
        },false)
        //cloud stroke animation
        const cloudStrokeAnimation: any = pathRevealAnimation(`#${styles["cloud-stroke"]}`, 'linear', CLOUD_STROKE_DURATION, false);

        //rain animation
        const rainAnimation: any = pathRevealAnimation(`#${styles["cloudy-rain"]} path`, 'linear', RAIN_DURATION, false);
        rainAnimation.changeComplete =  () => {
            const path: NodeListOf<SVGPathElement> = document.querySelectorAll(`#${styles["cloudy-rain"]} path`);
            for (let i = 0; i < path.length; i++) {
                path[i].style.transform = "rotate(180deg)";
            }
        }
        //rain drop
        const raindropAnimation: any = propertiesStagesAnimation(`#${styles["cloudy-rain"]} path`, 'linear', RAIN_DURATION, {
            opacity: [0, 1],
            strokeDashOffset: [0, anime.setDashoffset],
            strokeDasharray: [ "3"],
        }, false);
        //timeline adding
        timeline.add(cloudStrokeAnimation);
        timeline.add(cloudExpandAnimation);
        timeline.add(rainAnimation);
        timeline.add(raindropAnimation);
    }
    const animationRainDropDashArray = (timeoutDur: number) => {
        const timeout = setTimeout(() => {
            const anim = anime({
                targets: `#${styles["cloudy-rain"]} path`,
                strokeDasharray: [ "3"
                ],
                easing: 'linear',
                
                duration: 1000,
            });
        }, timeoutDur);
        return timeout
    }
    const setUp = () => {
        //cloudy-circle random spawner

    }
    useEffect(() => {
        startAnimation();
        /*const timeout = animationRainDropDashArray(3000);
        return () => {
            clearTimeout(timeout);
        } */
    },[])
    return (
        <div className={styles['cloudy']}>
              <div id={styles['cloudy-circles-container']} clip-path="url(#cloudy-filled-clip)">
                    <div className={styles['cloudy-circle']}></div>
                    <div className={styles['cloudy-circle']}></div>
                    <div className={styles['cloudy-circle']}></div>
                </div>
            <svg id={styles['cloudy-svg']} width="50mm" height="40mm" version="1.1" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg">
                <g id={styles['cloudy-rain']} fill="none" stroke="#4eb0e8" stroke-linecap="round" stroke-width="1.3229">
                    <path d="m13.664 22.885-3.815 9.057"/>
                    <path d="m26.773 22.985-3.4815 9.057"/>
                    <path d="m39.882 23.018-3.4815 9.057"/>
                </g>
              
                <clipPath id="cloudy-filled-clip">
                    <path id={styles["cloud-filled"]} d="m40.94 22.547-28.469-0.19862c-2.2069-0.0154-3.9936-3.0653-3.9063-5.6939 0.18141-5.4599 3.3137-7.5398 4.6345-8.5408 1.7614-1.3348 5.8669-2.093 8.2097-1.5228 2.9774 0.72471 5.2479 2.5839 6.9518 4.767 2.1686 2.7783 1.589 4.4359 1.589 4.4359 0.97762-2.7787 3.9083-4.4654 6.8856-4.5021 3.0538-0.03771 4.9238 1.6992 6.2897 4.2373 1.1794 2.2147 1.0703 6.8856-2.1849 7.018z" fill="#5300d4"/>
                </clipPath>

                
                <path id={styles["cloud-stroke"]} d="m40.94 22.547-28.469-0.19862c-2.2069-0.0154-3.9936-3.0653-3.9063-5.6939 0.18141-5.4599 3.3137-7.5398 4.6345-8.5408 1.7614-1.3348 5.8669-2.093 8.2097-1.5228 2.9774 0.72471 5.2479 2.5839 6.9518 4.767 2.1686 2.7783 1.589 4.4359 1.589 4.4359 0.97762-2.7787 3.9083-4.4654 6.8856-4.5021 3.0538-0.03771 4.9238 1.6992 6.2897 4.2373 1.1794 2.2147 1.0703 6.8856-2.1849 7.018z" fill="none" stroke="#7200ec" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3229" />
            </svg>
            
        </div>
    );
};

export default Cloudy;


