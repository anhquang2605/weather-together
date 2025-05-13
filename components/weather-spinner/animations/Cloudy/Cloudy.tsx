import React, { use, useEffect } from 'react';
import styles from './cloudy.module.css';
import anime from 'animejs';
import { getPathLength, pathRevealAnimation, pathShrinkAnimation, propertiesStagesAnimation } from '../../../../libs/anime-animations-helpers';
import { resourceUsage } from 'process';
import { time } from 'console';

interface CloudyProps {

}

const Cloudy: React.FC<CloudyProps> = ({}) => {
    const startAnimation = () => {
        //animation constants
        const theCloudyRain: HTMLElement | null = document.getElementById(`${styles["cloudy-rain"]}`);
        const CLOUD_STROKE_DURATION = 700;
        const CLOUD_EXPAND_DURATION = 1000;
        const RAIN_DURATION = 500;
        const REVERSE_PHASE_DELAY = 1000;
        //timeline set up
        const timeline = anime.timeline({});
        //cloud expand animation
        const cloudExpandAnimation: any = propertiesStagesAnimation(`.${styles["cloudy-circle"]}`, 'easeInExpo', CLOUD_EXPAND_DURATION, {
            scale: [0, 3],
            delay: anime.stagger(200, {from: 'center'})
        },false)
        //cloud shrink animation
        const cloudShrinkAnimation: any = propertiesStagesAnimation(`.${styles["cloudy-circle"]}`, 'easeInExpo', CLOUD_EXPAND_DURATION, {
            scale: [3, 0],
            delay: anime.stagger(200, {from: 'center'})
        }, false)
        //cloud stroke animation
        const cloudStrokeAnimation: any = pathRevealAnimation(`#${styles["cloud-stroke"]}`, 'linear', CLOUD_STROKE_DURATION, false);
        cloudStrokeAnimation.begin = () => {
            if (theCloudyRain) {
                theCloudyRain.classList.add(styles['hidden'])
            }
          
        }
       //cloud stroke animation reverse
        const cloudStrokeAnimationReverse: any = pathShrinkAnimation(`#${styles["cloud-stroke"]}`, 'linear', CLOUD_STROKE_DURATION, false);
        cloudStrokeAnimationReverse.begin = () => {
            if (theCloudyRain) {
                theCloudyRain.classList.add(styles['hidden'])
            }
        }
        //rain animation
        const rainAnimation: any = pathRevealAnimation(`#${styles["cloudy-rain"]} path`, 'linear', RAIN_DURATION, false);
        rainAnimation.begin = () => {
            if (theCloudyRain) {
                theCloudyRain.classList.remove(styles['hidden'])
            }
        }
        //
        const path: NodeListOf<SVGPathElement> = document.querySelectorAll(`#${styles["cloudy-rain"]} path`);
        rainAnimation.changeComplete =  () => {
            for (let i = 0; i < path.length; i++) {
                path[i].style.transform = "rotate(180deg)";
            }
        }
        
/*         const rainReverseAnimation: any = pathShrinkAnimation(`#${styles["cloudy-rain"]} path`, 'linear', RAIN_DURATION, false);
        const rainReverseAnimation2: any = pathRevealAnimation(`#${styles["cloudy-rain"]} path`, 'linear', RAIN_DURATION, false)
        const rainReverseAnimation3: any = {...rainReverseAnimation2};
        rainReverseAnimation.begin = () => {
            for (let i = 0; i < path.length; i++) {
                path[i].style.transform = "rotate(180deg)";
            }
        } */
     
        const rainAnimation2: any = pathShrinkAnimation(`#${styles["cloudy-rain"]} path`, 'linear', RAIN_DURATION, false);
        const rainAnimation3: any = {...rainAnimation2};
        const rainReverseAnimation: any = pathRevealAnimation(`#${styles["cloudy-rain"]} path`, 'linear', RAIN_DURATION, false);
        const rainReverseAnimation2: any = {...rainReverseAnimation};
        /* const rainRerverseAnimation3: any  = pathShrinkAnimation(`#${styles["cloudy-rain"]} path`, 'linear', RAIN_DURATION, false);
        const rainRerverseAnimation4: any = {...rainRerverseAnimation3}; */
        const rainReverseAnimation3 = propertiesStagesAnimation(`#${styles["cloudy-rain"]} path`, 'linear', RAIN_DURATION, {
            strokeDashoffset: anime.setDashoffset,
        }, false);
        //const rainReverseAnimation4: any = {...rainRerverseAnimation3};
        //rain drop reverse   
        //rain drop
        const raindropAnimation: any = propertiesStagesAnimation(`#${styles["cloudy-rain"]} path`, 'linear', RAIN_DURATION, {
            
            strokeDasharray: "2",
            
        }, false);
        const rainLength = getPathLength(`#${styles["cloudy-rain"]} path:first-child`);
        const rainReverseDropAnimation: any = propertiesStagesAnimation(`#${styles["cloudy-rain"]} path`, 'linear', RAIN_DURATION, {
            
            strokeDasharray: `${rainLength}`,

        }, false);
        
        rainReverseDropAnimation.begin = () => {
            for (let i = 0; i < path.length; i++) {
                path[i].style.transform = "rotate(0deg)";
            }
        }

        //timeline adding
        //forward phase
        //timeline.add(cloudStrokeAnimation);
        //timeline.add(cloudExpandAnimation);
        timeline.add(rainAnimation);
        timeline.add(raindropAnimation);
        /*timeline.add(rainAnimation2);
        timeline.add(rainAnimation3); */
        //reverse phase
        /* timeline.add(rainReverseAnimation)
        timeline.add(rainReverseAnimation2); */
        timeline.add(rainReverseDropAnimation);
        timeline.add(rainReverseAnimation3, "+=" + 100);
        //timeline.add(rainRerverseAnimation4);
        //timeline.add(rainReverseDropAnimation, "+=" + REVERSE_PHASE_DELAY);
        //timeline.add(rainReverseAnimation);
        //timeline.add(cloudShrinkAnimation);
        //timeline.add(cloudStrokeAnimationReverse);

    }

    useEffect(() => {
        //setUp();
        startAnimation();
       
    },[])
    return (
        <div className={styles['cloudy']}>
              <div id={styles['cloudy-circles-container']} clip-path="url(#cloudy-filled-clip)">
                    <div className={styles['cloudy-circle']}></div>
                    <div className={styles['cloudy-circle']}></div>
                    <div className={styles['cloudy-circle']}></div>
                </div>
            <svg id={styles['cloudy-svg']} width="50mm" height="40mm" version="1.1" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg">
                <g id={styles['cloudy-rain']} fill="none" stroke="#4eb0e8" stroke-linecap="round" stroke-width="1.3">
                    <path d="m13.773 22.885-3.815 9.057"/>
                    <path d="m26.773 22.885-3.815 9.057"/>
                    <path d="m39.773 22.885-3.815 9.057"/>
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


