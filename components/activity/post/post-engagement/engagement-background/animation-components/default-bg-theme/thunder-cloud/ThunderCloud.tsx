import React, { useEffect } from 'react';
import style from './thunder-cloud.module.css';
import { SVGCloudPropType } from '../svg-cloud-types';
import { pathRevealAnimation, propertiesStagesAnimation } from '../../../../../../../../libs/anime-animations-helpers';
import anime from 'animejs';
import { time } from 'console';

interface ThunderCloudProps extends SVGCloudPropType {};

const ThunderCloud: React.FC<ThunderCloudProps> = (props) => {
    const {
        duration = 2000,
        delay = 0,
        easing = 'linear',
        targetClassName = '',
    } = props;
    //settings
    const CLOUD_SMALL_SCALE = 0.5;
    const CLOUD_BIG_SCALE = 1;
    const FLASH_COLOR = '#f7ff00'
    const CLOUD_COLOR = '#222';
    const CLOUD_EXPAND_DURATION_PERCENT = 0.85;
    const THUNDER_STRIKE_DURATION_PERCENT = 1 - CLOUD_EXPAND_DURATION_PERCENT;
   

    const startAnimation = () => {
        //setting up variables
        const cloudExpandDuration = duration * CLOUD_EXPAND_DURATION_PERCENT;
        const thunderStrikeDuration = duration * THUNDER_STRIKE_DURATION_PERCENT;
        const THUNDER_CLOUD_AND_FACE_SELECTOR = `#${style['thunder-cloud']} , #${style['thunder-cloud-face']}`
        const timeline = anime.timeline({
            delay: delay
        });
        //Cloud expand stage
        const cloudExpandAnim: any = propertiesStagesAnimation(THUNDER_CLOUD_AND_FACE_SELECTOR, easing, duration * CLOUD_EXPAND_DURATION_PERCENT, {scale: [0.5, 1]}, false);
        timeline.add(cloudExpandAnim);
        //Thunder strike stage

        const thunderStrikeAnim: any = pathRevealAnimation('#thunder-strike path', easing, thunderStrikeDuration, false);
        //thunder cloud shrink and blink
        const thunderCloudShrinkandBlinkAnim: any = propertiesStagesAnimation(THUNDER_CLOUD_AND_FACE_SELECTOR, 'easeOutElastic(1,0.5)', duration * THUNDER_STRIKE_DURATION_PERCENT, 
            {
                scale: [1,0.8],
               
            }
            , false);
        
        const thunderCloudBrinkAnim: any = propertiesStagesAnimation("#" +style['thunder-cloud'], 'linear', duration * THUNDER_STRIKE_DURATION_PERCENT,
            {
                fill: [CLOUD_COLOR,FLASH_COLOR, CLOUD_COLOR]
            }
            , false);
        timeline.add(thunderCloudBrinkAnim, cloudExpandDuration);
        timeline.add(thunderCloudShrinkandBlinkAnim, cloudExpandDuration);
        timeline.add(thunderStrikeAnim,  cloudExpandDuration);
    }
    useEffect(() => {
        startAnimation();
    },[])
    return (
<div className={style['thunder-cloud'] + " " + targetClassName}>
<svg width="43.461mm" height="48.202mm" version="1.1" viewBox="0 0 43.461 48.202" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="filter5" x="-.48879" y="-.29104" width="2.0324" height="1.5821" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="1.5913299"/>
        </filter>
    </defs>
    <g transform="translate(-51.052 -25.084)">
        <g id="thunder-strike" fill="none" stroke="#ffea69" strokeLinecap="round">
            <path d="m73.762 52.823-5.8494 6.7929 10.661 3.3021-6.4155 3.6795 1.6039 2.0756" filter="url(#filter5)" strokeWidth="1.5875" />
            <path d="m73.967 52.645-5.8494 6.7929 10.661 3.3021-6.4155 3.6795 1.6039 2.0756" strokeWidth="1.323"/>
        </g>
        <path d="m87.088 34.607c0.09183-0.48812 0.13972-0.99176 0.13972-1.5068 0-4.4271-3.543-8.016-7.9136-8.016-2.6741 0-5.0385 1.3436-6.4709 3.4007-1.3753-1.1695-3.1491-1.8738-5.0851-1.8738-4.3286 0-7.8455 3.5203-7.9126 7.8887h-9.96e-4c-4.8561 0-8.7927 3.9875-8.7927 8.9066 0 4.919 3.9366 8.9066 8.7927 8.9066h25.876c4.856 0 8.7927-3.9876 8.7927-8.9066 0-4.4478-3.2185-8.1339-7.4251-8.7994z" fill="#222" strokeWidth=".52363" id={style["thunder-cloud"]}/>
        <g stroke="#aaa4a4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3229" id={style["thunder-cloud-face"]}>
            <g transform="translate(2.2844)" fill="#202020" >
                <path d="m63.306 42.978 5.0003 2.3586"/>
                <path d="m77.69 42.978-5.0003 2.3586"/>
            </g>
            <path d="m70.252 48.484s0.5515-1.368 2.4956-1.3208c1.9441 0.04717 2.565 1.3208 2.565 1.3208" fill="none" />
        </g>
    <path d="m72.08 51.701-7.7363 9.6233h15.284l-8.8685 7.5476" fill="none"/>
    </g>
</svg>
</div>
    );
};

export default ThunderCloud;