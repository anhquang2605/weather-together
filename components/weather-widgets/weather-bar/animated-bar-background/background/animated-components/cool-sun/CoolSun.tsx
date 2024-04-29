import React, { useEffect, useRef, useState } from 'react';
import useFlexState from './useFlexState';
import styles from './cool-sun.module.css';
import anime, { AnimeInstance } from 'animejs';
import { endOfDay } from 'date-fns';
import e from 'express';
import { findLastKey } from 'lodash';
interface CoolSunProps {
    isAnimated: boolean;
}
interface AnimePropertyType {
    [key: string]: any
}
const CoolSun: React.FC<CoolSunProps> = ({isAnimated}) => {
    //CONSTANTS
    const REVEAL_DURATION = 200;
    const SUN_RADIATE_DURATION = 3000;
    const SUN_RADIATE_END_DELAY_DURATION = 250;
    const FLEXING_DURATION = 750;
    const LOOSE_DURATION = 350;
    const FLEX_DELAY = 1000;
    const LOOSE_DELAY = SUN_RADIATE_DURATION;
    const SUN_FLEX_LOOSE_DURATION = LOOSE_DURATION + FLEXING_DURATION + FLEX_DELAY * 2 + LOOSE_DELAY;
    const SUN_RADIATION_SPEED = 6;
    //hook states
    //const {toggleFlex, memorizedIsFlexed} = useFlexState();
    //interal variables
    let isFlexEnded:boolean = false;
    //STATES
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const isFlexEndedRef = useRef<boolean>(false);
    const sunRadiationAnimationRef = useRef<AnimeInstance | undefined>(); 
    const eyeAppearAnimationRef = useRef<AnimeInstance | undefined>();
    const armFlexingAnimationRef = useRef<AnimeInstance | undefined>();
    const leftFlexingAnimationRef = useRef<AnimeInstance | undefined>();
    const rightFlexingAnimationRef = useRef<AnimeInstance | undefined>(); 
    const toggle = () => {
        faceReveal();
        armReveal();
        //sunRadiate();
        eyeBlink();
        smile();
        armFlexing(isAnimated);
    }
    const toggleFlexEndedVariable = (newState: boolean) => {
        console.log(newState);
        isFlexEnded = newState;
        sunRadiate();
    }
    const initializeAnimation = () => {
        const FULL_STROKE_SET_PROPERTY_OBJECT = {strokeDashoffset: anime.setDashoffset}; 
        animeSet('#arms path', FULL_STROKE_SET_PROPERTY_OBJECT );
        animeSet('#eyes path', FULL_STROKE_SET_PROPERTY_OBJECT);
        animeSet('#mouth path', FULL_STROKE_SET_PROPERTY_OBJECT );
        animeSet(`#${styles['eyes_opened']} circle`, {scaleY: 0});
        animeSet('#sun_radiant path', FULL_STROKE_SET_PROPERTY_OBJECT);
        animeSet('#mouth_smile', {opacity:0})
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
        const target = `#${styles['eyes_opened']} circle`;
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
    const smile = (isSmiling?: boolean) => {
        const straight = 'M147 154C151 154 146.827 154 151.733 154C156.64 154 152 154 156.5 154';
        const smile = 'M140 149C143.067 153.091 145.827 154 150.733 154C155.64 154 159.933 153.091 163 149';
        const mouth_smile = '#mouth_smile';

        if(isSmiling || isAnimated){
            anime({
                targets: mouth_smile,
                opacity: 1,
                d: {
                    value: [
                        straight,
                        smile
                    ],
                    duration: REVEAL_DURATION,
                    easing: 'linear'
                }
            })
        }else{
            anime({
                targets: mouth_smile,
                opacity: 0,
                d: {
                    value: [
                        smile,
                        straight
                    ],
                    duration: REVEAL_DURATION
                }
            })
        }
    }
    const sunRadiate = () => {
        const targets = "#sun_radiant path";
        if(sunRadiationAnimationRef && sunRadiationAnimationRef.current ){
            if(isFlexEnded && isAnimated){
   
                sunRadiationAnimationRef.current.play();
            }else{
                sunRadiationAnimationRef.current.pause();
                sunRadiationAnimationRef.current.restart();
            }
        }else{
            if(!isFlexEnded){
                return;
            }
            const firstRadiationSelector = '#sun_radiant path:first-child';
            const pathLen = getSVGPathLen(firstRadiationSelector);
            const timeline = anime({
                loop: 5,
                duration: SUN_RADIATE_DURATION / SUN_RADIATION_SPEED,
                targets: targets,
                strokeDashoffset: [-pathLen, anime.setDashoffset],
                //delay: FLEXING_DURATION + FLEX_DELAY,

                easing: 'linear'
            });
            sunRadiationAnimationRef.current =  timeline
        }
       
    }
    const armFlexEndCallBack = (anim:AnimeInstance) => {
        let currentTime = anim.currentTime;
        let totalDuration = anim.duration;
        if(currentTime >= totalDuration && isFlexEnded == false){
            toggleFlexEndedVariable(true);
        }
    }
    const armLooseStartCallBack = (anim:AnimeInstance) => {
        let currentTime = anim.currentTime;
        if(currentTime >= LOOSE_DELAY && isFlexEnded == true){
            toggleFlexEndedVariable(false);
        }
        
    }
    const armFlexing = (isFlexing:boolean) => {
        //PATH DEFINITION CONSTANT
        const LEFT_ARM_OUT = "M57.4939 154C10.8344 154 4.83454 192 21.3345 205";
        const LEFT_ARM_CLOSE = "M57.6596 154C53.1596 172.5 72.1596 186.5 100.16 186.5";
        const RIGHT_ARM_OUT = "M247 154C293.66 154 299.659 192 283.159 205";
        const RIGHT_ARM_CLOSE = "M246.5 154C251 172.5 232 186.5 204 186.5";
        
        //PATHS' ID
        const LEFT_ARM_SELECTION = "#left_arm";
        const RIGHT_ARM_SELECTION = "#right_arm";
        //ANIMATION HOLDER
        let leftFlexAnimation;
        let leftLooseAnimation;
        let rightFlexAnimation;
        let rightLooseAnimation;
        let leftAnimation;
        let rightAnimation;
            if(leftFlexingAnimationRef && leftFlexingAnimationRef.current && rightFlexingAnimationRef && rightFlexingAnimationRef.current){
                if(!isAnimated){
                    timelineRefReset(leftFlexingAnimationRef.current);
                    timelineRefReset(rightFlexingAnimationRef.current)
                }else{
                    leftFlexingAnimationRef.current.play();
                    rightFlexingAnimationRef.current.play();
                }
                
            }else{
                if(!isAnimated){
                    return;
                }
                leftFlexAnimation = producePathMorphAnimation(LEFT_ARM_OUT,LEFT_ARM_CLOSE, LEFT_ARM_SELECTION, FLEXING_DURATION, FLEX_DELAY,0,'linear', true, armFlexEndCallBack);
                leftLooseAnimation = producePathMorphAnimation(LEFT_ARM_CLOSE,LEFT_ARM_OUT, LEFT_ARM_SELECTION, LOOSE_DURATION, LOOSE_DELAY, FLEX_DELAY,'spring', true, armLooseStartCallBack
                );
                rightFlexAnimation = producePathMorphAnimation(RIGHT_ARM_OUT,RIGHT_ARM_CLOSE, RIGHT_ARM_SELECTION, FLEXING_DURATION, FLEX_DELAY);
                rightLooseAnimation = producePathMorphAnimation(RIGHT_ARM_CLOSE, RIGHT_ARM_OUT, RIGHT_ARM_SELECTION, LOOSE_DURATION,LOOSE_DELAY, FLEX_DELAY, 'spring');
                let timeline1  = anime.timeline({
                    loop: true,
                    duration: FLEXING_DURATION,
                })
                let timeline2 = anime.timeline({
                    loop: true,
                    duration: FLEXING_DURATION
                })
                timeline1.add(leftFlexAnimation).add(leftLooseAnimation)
                timeline2.add(rightFlexAnimation).add(rightLooseAnimation)
                leftFlexingAnimationRef.current = timeline1;
                rightFlexingAnimationRef.current = timeline2;

            }
    }
    const timelineRefReset = (animeObj: AnimeInstance) => {
        animeObj.restart();
        animeObj.pause();
    }
    const timelineRefPlay = (animeObj: AnimeInstance) => {
        animeObj.play();
    }
    const armShaking = () => {

    }
    const producePathMorphAnimation = (d1: string, d2: string, target: string, duration: number, delay:number = 0, endDelay:number = 0,  easing : string = 'linear', hasCallback:boolean = false, callback: (anim:AnimeInstance) => void = () => {}, callbackStage: string = 'update' ) =>{
        let animObj:any = {
            targets: target,
            d:{
                value: [
                   d1,
                   d2
                ],
                duration: duration,
            },
            delay: delay,
            endDelay: endDelay,
            //complete: midCallback,,
            easing: easing,

        }
        if(hasCallback){
            animObj[callbackStage] = (anim:AnimeInstance)=>{
                callback(anim)
            }
        }
        return animObj;
    }
    function springEasing(t:number) {
        return 1 - Math.pow(Math.cos(t * Math.PI * 4), 3);
      }
      
    
    useEffect(()=>{
        if(isInitialized){
            toggle();
        }
    },[
        isAnimated
    ])
/*     useEffect(()=>{
        //sunRadiate(isFlexEnded);
        console.log(isFlexEnded);
    }, [isFlexEnded]) */
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
                    <g  id={styles["eyes_opened"]}>
                        <circle id="left_open_eye" cx="130.75" cy="139.75" r="7.75" fill="black"/>
                        <circle id="right_open_eye" cx="171.75" cy="139.75" r="7.75" fill="black"/>
                    </g>
                    <g id="mouth">
                        <path id="left_3" d="M152 153H147" stroke="black" strokeWidth="5" strokeLinecap="round"/>
                        <path id="right_3" d="M152 153H157" stroke="black" strokeWidth="5" strokeLinecap="round"/>
                    </g>
                    <path id="mouth_smile" d="M147 154C151 154 146.827 154 151.733 154C156.64 154 152 154 156.5 154" stroke="black" strokeWidth="5" strokeLinecap="round"/>
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