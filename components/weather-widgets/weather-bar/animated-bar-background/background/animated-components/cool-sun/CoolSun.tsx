import React, { useEffect, useRef, useState } from 'react';
import styles from './cool-sun.module.css';
import anime, { AnimeInstance } from 'animejs';
interface CoolSunProps {
    isAnimated: boolean;
}
interface AnimePropertyType {
    [key: string]: any
}
const CoolSun: React.FC<CoolSunProps> = ({isAnimated}) => {
    //CONSTANTS
    const REVEAL_DURATION = 100;
    const SUN_RADIATE_DURATION = 500;
    const SUN_RADIATE_END_DELAY_DURATION = 250;

    //STATES
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const sunRadiationAnimationRef = useRef<AnimeInstance | undefined>(); 
    const eyeAppearAnimationRef = useRef<AnimeInstance | undefined>();
    const toggle = () => {
        faceReveal();
        armReveal();
        sunRadiate();
        eyeBlink();
    }
    const initializeAnimation = () => {

        animeSet('#arms path', {strokeDashoffset: anime.setDashoffset});
        animeSet('#eyes path', {strokeDashoffset: anime.setDashoffset});
        animeSet('#mouth path', {strokeDashoffset: anime.setDashoffset} );
        animeSet('#eyes_opened circle', {style: 'transform:scaleY(0)'});
        //animeSet('#sun_radiant path', {strokeDashoffset: pathLength / 2})
        setIsInitialized(true);
    }
    const animeSet = (targets: string,   properties:AnimePropertyType) => {
        anime.set(targets, properties);
    }
    const getSVGPathLen = (target: string) =>  {
        const thePath:SVGGeometryElement|null = document.querySelector(target);
        let len = 0;
        if(thePath){
            len = thePath.getTotalLength();
        }
        return len;
    }
    const pathRevealAnimation = (paths: string[], duration: number) => {
        if(isAnimated){
            anime({
                targets: paths,
                strokeDashoffset: [anime.setDashoffset, 0],
                easing: 'linear',
                duration: duration,
               })
            
        }else{
            anime({
                targets: paths,
                strokeDashoffset: [0, anime.setDashoffset],
                easing: 'linear',
                duration: duration,
               })
        }
    }
    const armReveal = () => {
        const targets = ['#arms path']
        pathRevealAnimation(targets, REVEAL_DURATION);
    }
    const faceReveal = () => {
        const targets = ['#eyes path','#mouth path']
        pathRevealAnimation(targets, REVEAL_DURATION);    
    }
    const eyeBlink = (isOpened?: boolean) => {
        const target = '#eyes_opened circle';
        if(isOpened || isAnimated){
            anime({
                targets: target,
                duration: REVEAL_DURATION,
                scaleY: '1',
            })
        }else{
            anime({
                targets: target,
                duration: REVEAL_DURATION,
                scaleY: '0',
            })
        }
    }
    const sunRadiate = () => {
        const targets = "#sun_radiant path";
        if(sunRadiationAnimationRef && sunRadiationAnimationRef.current ){
            if(isAnimated){
                sunRadiationAnimationRef.current.play();
            }else{
                sunRadiationAnimationRef.current.restart();
                sunRadiationAnimationRef.current.pause();

            }
        }else{
            const firstRadiationSelector = '#sun_radiant path:first-child';
            const pathLen = getSVGPathLen(firstRadiationSelector);
            sunRadiationAnimationRef.current =  anime({
                targets: targets,
                strokeDashoffset: [-pathLen, anime.setDashoffset],
                loop: Infinity,
                duration: SUN_RADIATE_DURATION,
                endDelay: SUN_RADIATE_END_DELAY_DURATION,
                easing: 'linear'
            })
        }
       
    }
    useEffect(()=>{
        if(isInitialized){
            toggle();
        }
    },[
        isAnimated
    ])
    
    useEffect(()=>{
        initializeAnimation();
    })
    return (
        <div className={styles['cool-sun']}>
            <svg width="45%" viewBox="0 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="cool_sun" clipPath="url(#clip0_12_4)">
                    <circle id="Ellipse 3" cx="152" cy="152" r="108" fill="yellow" fillOpacity="0.2"/>
                    <circle id="Ellipse 4" cx="151" cy="148" r="136" fill="yellow" fillOpacity="0.2"/>
                    <g id="body">
                        <circle id="inner_body" cx="152" cy="152" r="92" fill="#EDA10D"/>
                        <circle id="outer_body" cx="151.5" cy="151.5" r="83.5" fill="#FDC04C"/>
                    </g>
                    <g id="sun_radiant">
                        <path id="Line 10" d="M255.991 255.991L227 227" stroke="#BA3902" strokeOpacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                        <path id="Line 7" d="M5.5 152L46.5 152" stroke="#BA3902" strokeOpacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                        <path id="Line 6" d="M48.4089 255.591L77.4002 226.6" stroke="#BA3902" strokeOpacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                        <path id="Line 5" d="M152 298.5V257.5" stroke="#BA3902" strokeOpacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                        <path id="Line 9" d="M48 49L76.9914 77.9914" stroke="#BA3902" strokeOpacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                        <path id="Line 3" d="M298.5 152H257.5" stroke="#BA3902" strokeOpacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                        <path id="Line 2" d="M255.591 48.4089L226.6 77.4002" stroke="#BA3902" strokeOpacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                        <path id="Line 1" d="M152 5.5V46.5" stroke="#BA3902" strokeOpacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                    </g>
                <g id="arms">
                    <path id="left_arm" d="M58 152C76.8404 167.5 79.8404 169.5 100.5 184.5" stroke="black" strokeWidth="5" strokeLinecap="round"/>
                    <path id="right_arm" d="M246.84 152C229.84 166 226.84 168.5 204.34 184.5" stroke="black" strokeWidth="5" strokeLinecap="round"/>
                </g>
                <g id="face_1">
                    <g id="eyes">
                        <g id={styles["left_eye"]}>
                            <path id="left" d="M131 140H126" stroke="black" strokeWidth="5" strokeLinecap="round"/>
                            <path id="right" d="M131 140H136" stroke="black" strokeWidth="5" strokeLinecap="round"/>
                        </g>
                        <g id={styles["right_eye"]}>
                            <path id="left_2" d="M172 140H167" stroke="black" strokeWidth="5" strokeLinecap="round"/>
                            <path id="right_2" d="M172 140H177" stroke="black" strokeWidth="5" strokeLinecap="round"/>
                        </g>
                    </g>
                    <g style={{
                        transformOrigin: "50% 50%",
                    }} id="eyes_opened">
                        <circle id="left_open_eye" cx="130.75" cy="139.75" r="7.75" fill="black"/>
                        <circle id="right_open_eye" cx="171.75" cy="139.75" r="7.75" fill="black"/>
                    </g>
                    <g id="mouth">
                        <path id="left_3" d="M152 153H147" stroke="black" strokeWidth="5" strokeLinecap="round"/>
                        <path id="right_3" d="M152 153H157" stroke="black" strokeWidth="5" strokeLinecap="round"/>
                    </g>
                </g>
            </g>
            <defs>
                <clipPath id="clip0_12_4">
                    <rect width="304" height="304" fill="white"/>
                </clipPath>
            </defs>
            </svg>
        </div>
    );
};

export default CoolSun;