import React, { useEffect, useRef, useState } from 'react';
import styles from './happy-moon.module.css';
import anime, { AnimeInstance } from 'animejs';
interface HappyMoonProps {
    isAnimated: boolean;
    extraClassname?: string;
}

const HappyMoon: React.FC<HappyMoonProps> = ({isAnimated, extraClassname = ""}:HappyMoonProps) => {
    const [speed, setSpeed] = useState(1);
    const armToggleAnimationRef = useRef<undefined | AnimeInstance >();
    const cheeksRaiseAnimationRef = useRef<undefined | AnimeInstance>();

    const greeting = () => {
        spin();
        armSpin();
        armToggle();
        squint();
    }
    const float = () => {

    }
    const squint = () => {
        if(cheeksRaiseAnimationRef && cheeksRaiseAnimationRef.current){
            if(isAnimated){
                cheeksRaiseAnimationRef.current.play();
            }else{
                cheeksRaiseAnimationRef.current.pause();
            }
        }else{
            if(!isAnimated){
                return;
            }
            cheeksRaiseAnimationRef.current = anime({
                targets: '#cheek-eyes',
                duration: 1500,
                translateY: "-10",
                direction: 'alternate',
                easing: 'spring',
                loop: true
            })
        }
        
    }
    const spin = () => {
        const theFace = document.getElementById(styles['the-face']);
        const theMoonBody = document.getElementById(styles['moon_2']);

        if(theFace && theMoonBody){
            if(isAnimated){
               
                theFace.style.transform = "translateX(0px)";
                theMoonBody.style.transform = "translateX(0px)";
            } else {
                theFace.style.transform = "translateX(-303px)";
                theMoonBody.style.transform = "translateX(-303px)";
            }
           
        }
    }
    const armSpin = () => {
        if(isAnimated){
            anime({
                targets: `#${styles['arms']}`,
                rotate: 0,
                duration: 500,
                easing: 'spring'
            })
        }else{
            anime({
                targets: `#${styles['arms']}`,
                rotate: 30,
                duration: 500,
                easing: 'spring'
            })
        }
    }
    const armToggle = () => {
        let animation;
            if(armToggleAnimationRef && armToggleAnimationRef.current){
                if(!isAnimated){
                    armToggleAnimationRef.current.pause();
                }else{
                    armToggleAnimationRef.current.play();
                }
                
            }else{
                if(!isAnimated){
                    return;
                }
                animation = anime({
                    targets: `#${styles['arms']}`,
                    d:{
                        value: [
                            "M96.1131 237.148C89.1728 242.516 61.906 240.067 54.1131 218C43.0654 186.716 84.6913 133.447 86 127",
                            "M96.1131 237.148C89.1728 242.516 51.7929 241.067 44 219C32.9523 187.716 12.6912 137.447 14 131"
                        ],
                        duration: 500,
                        easing: 'linear',
                    },
                    direction: 'alternate',
                    loop: true
                    
                })
                armToggleAnimationRef.current = animation;
            }
    }
    const jiggle = () => {
        const theBody = document.getElementById('the-body');

    }
    useEffect(()=>{
            greeting();
    },[isAnimated])
    return (
        <div className={`${styles['happy-moon']} ${extraClassname}`}>
            <svg width="45%"   viewBox="0 -25 450 450" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="moon" clipPath="url(#clip0_0_1)">
                <g id="the-body">
                <circle id="second-radiant" cx="232.5" cy="202.5" r="202.5" fill="#FAE62D" fillOpacity="0.13"/>
                <circle id="first-radiant" cx="234.5" cy="202.5" r="177.5" fill="#FAE62D" fillOpacity="0.13"/>
                <path id={styles["arms"]} d="M96.1131 237.148C89.1728 242.516 61.906 240.067 54.1131 218C43.0654 186.716 84.6913 133.447 86 127" stroke="#3B1212" strokeWidth="25" strokeLinecap="round"/>
                <ellipse id="dark body" cx="232.5" cy="202" rx="148.5" ry="150" fill="#FCC000"/>
                <g id="light-body">
                    <mask id="mask0_0_1" className={styles['mask-alpha']} maskUnits="userSpaceOnUse" x="95" y="66" width="275" height="275">
                    <circle id="Ellipse 8" cx="232.5" cy="203.5" r="137.5" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_0_1)">
                        <g id={styles["moon_2"]}>
                        <rect width="712" height="345" fill="#FAE62D"/>
                        <circle cx="206.5" cy="40.5" r="6.5" fill="#FCC000"/>
                        <circle cx="217.5" cy="275.5" r="12.5" fill="#FCC000"/>
                        <circle cx="368" cy="215" r="31" fill="#FCC000"/>
                        <circle cx="99" cy="237" r="31" fill="#FCC000"/>
                        <circle cx="606.5" cy="114.5" r="43.5" fill="#FCC000"/>
                        <circle cx="528.5" cy="295.5" r="49.5" fill="#FCC000"/>
                        <circle cx="5.5" cy="5.5" r="5.5" transform="matrix(-1 0 0 1 484 265)" fill="#FCC000"/>
                        <circle cx="658" cy="237" r="15" fill="#FCC000"/>
                        <circle cx="563" cy="143" r="15" fill="#FCC000"/>
                        <circle cx="53" cy="113" r="15" fill="#FCC000"/>
                        <circle cx="240" cy="159" r="13" fill="#FCC000"/>
                        <circle cx="460" cy="74" r="13" fill="#FCC000"/>
                        <circle cx="204.5" cy="297.5" r="21.5" fill="#FCC000"/>
                        </g>
                    </g>
                </g>
                <mask id="mask1_0_1" className={styles['mask-alpha']} maskUnits="userSpaceOnUse" x="84" y="168" width="300" height="68">
                <rect id="Rectangle 3" x="84" y="168" width="300" height="68" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask1_0_1)">
                    <g  id={styles['the-face']}>
                        <g id="face">
                            <g id="eyes">
                                <circle id="eye l" cx="185" cy="196" r="13" fill="#3C1212"/>
                                <circle id="eye r" cx="273" cy="196" r="13" fill="#3C1212"/>
                            </g>
                        <g id="cheek-eyes">
                            <circle id="cheek-eye-l" cx="185" cy="223" r="13" fill="#FAE62D"/>
                            <circle id="cheek-eye-r" cx="273" cy="223" r="13" fill="#FAE62D"/>
                        </g>
                        <path id="smile" d="M214 209C214 209 215.24 221 231.354 221C247.469 221 248 209 248 209" stroke="#3B1212" strokeWidth="10" strokeLinecap="round"/>
                        </g>
                    </g>
                </g>
                </g>
                
            </g>
            </svg>

        </div>
    );
};

export default HappyMoon;