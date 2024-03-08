import React, { useEffect, useState } from 'react';
import styles from './happy-moon.module.css';
import anime from 'animejs/lib/anime.es';
interface HappyMoonProps {
    isAnimated: boolean;
}

const HappyMoon: React.FC<HappyMoonProps> = ({isAnimated}:HappyMoonProps) => {
    const [speed, setSpeed] = useState(1);
    const greeting = (isAnimated:boolean) => {
        spin(isAnimated);
    }
    const glow = () => {

    }
    const wave = () => {

    }
    const squint = () => {
    }
    const spin = (isReversed:boolean) => {
        const theFace = document.getElementById('the-face');
        const theMoonBody = document.getElementById('moon_2');
        if(theFace && theMoonBody){
            if(isReversed){
                theFace.style.transform = "translateX(0px)";
                theMoonBody.style.transform = "translateX(0px)";
            } else {
                theFace.style.transform = "translateX(-300px)";
                theMoonBody.style.transform = "translateX(-300px)";
            }
           
        }
    }
    const armToggle = () => {
        
    }
    const jiggle = () => {
        
    }
    useEffect(()=>{
            greeting(isAnimated);
    },[isAnimated])
    return (
        <div className={styles['happy-moon']}>
            <svg width="35%"  viewBox="0 0 405 405" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="moon" clip-path="url(#clip0_0_1)">
                <circle id="second-radiant" cx="202.5" cy="202.5" r="202.5" fill="#FAE62D" fill-opacity="0.13"/>
                <circle id="first-radiant" cx="204.5" cy="202.5" r="177.5" fill="#FAE62D" fill-opacity="0.13"/>
                <path id="arms" d="M58.0002 210.947C50.0456 215.943 28.4319 215.538 19.5001 195C6.83787 165.884 48 120.5 49.5 114.5" stroke="#3B1212" stroke-width="20" stroke-linecap="round"/>
                <ellipse id="dark body" cx="202.5" cy="202" rx="148.5" ry="150" fill="#FCC000"/>
                <g id="light-body">
                    <mask id="mask0_0_1" className={styles['mask-alpha']} maskUnits="userSpaceOnUse" x="65" y="66" width="275" height="275">
                    <circle id="Ellipse 8" cx="202.5" cy="203.5" r="137.5" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_0_1)">
                        <g id="moon_2">
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
                <mask id="mask1_0_1" className={styles['mask-alpha']} maskUnits="userSpaceOnUse" x="54" y="168" width="300" height="68">
                <rect id="Rectangle 3" x="54" y="168" width="300" height="68" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask1_0_1)">
                    <g id="the-face">
                        <g id="face">
                            <g id="eyes">
                                <circle id="eye l" cx="155" cy="196" r="13" fill="#3C1212"/>
                                <circle id="eye r" cx="243" cy="196" r="13" fill="#3C1212"/>
                            </g>
                        <g id="cheek-eyes">
                            <circle id="cheek-eye-l" cx="155" cy="223" r="13" fill="#FAE62D"/>
                            <circle id="cheek-eye-r" cx="243" cy="223" r="13" fill="#FAE62D"/>
                        </g>
                        <path id="smile" d="M184 209C184 209 185.24 221 201.354 221C217.469 221 218 209 218 209" stroke="#3B1212" stroke-width="10" stroke-linecap="round"/>
                        </g>
                    </g>
                </g>
            </g>
                <defs>
                <clipPath id="clip0_0_1">
                <rect width="405" height="405" fill="white"/>
                </clipPath>
                </defs>
            </svg>

        </div>
    );
};

export default HappyMoon;