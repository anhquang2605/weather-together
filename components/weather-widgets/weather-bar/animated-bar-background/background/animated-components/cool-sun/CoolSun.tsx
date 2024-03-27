import React, { useEffect, useRef } from 'react';
import styles from './cool-sun.module.css';
import anime, { AnimeInstance } from 'animejs';
interface CoolSunProps {
    isAnimated: boolean;
}

const CoolSun: React.FC<CoolSunProps> = ({isAnimated}) => {
    const eyeAppearAnimationRef = useRef<AnimeInstance | null>(null);
    const toggle = () => {
        eyes();
    }
    const eyes = () => {
      
        if(isAnimated){
            anime({
                targets: '#eyes path',
                strokeDashoffset: [anime.setDashoffset, 0],
                easing: 'spring',
                duration: 300,
               })
        }else{
            anime({
                targets: '#eyes path',
                strokeDashoffset: [0, anime.setDashoffset],
                easing: 'spring',
                duration: 300,
               })
        }
      
        
    }
    useEffect(()=>{
        toggle();
    },[
        isAnimated
    ])
    return (
        <div className={styles['cool-sun']}>
            <svg width="45%" viewBox="0 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="cool_sun" clip-path="url(#clip0_12_4)">
                    <circle id="Ellipse 3" cx="152" cy="152" r="108" fill="yellow" fill-opacity="0.2"/>
                    <circle id="Ellipse 4" cx="151" cy="148" r="136" fill="yellow" fill-opacity="0.2"/>
                    <g id="body">
                        <circle id="inner_body" cx="152" cy="152" r="92" fill="#EDA10D"/>
                        <circle id="outer_body" cx="151.5" cy="151.5" r="83.5" fill="#FDC04C"/>
                    </g>
                <g id="sun_radiant">
                    <path id="Line 8" d="M48.4089 48.4089L77.4002 77.4002" stroke="#BA3902" stroke-opacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                    <path id="Line 7" d="M46.5 152H5.5" stroke="#BA3902" stroke-opacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                    <path id="Line 6" d="M77.4002 226.6L48.4089 255.591" stroke="#BA3902" stroke-opacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                    <path id="Line 5" d="M152 257.5V298.5" stroke="#BA3902" stroke-opacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                    <path id="Line 4" d="M255.591 255.591L226.6 226.6" stroke="#BA3902" stroke-opacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                    <path id="Line 3" d="M257.5 152H298.5" stroke="#BA3902" stroke-opacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                    <path id="Line 2" d="M226.6 77.4002L255.591 48.4089" stroke="#BA3902" stroke-opacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                    <path id="Line 1" d="M152 46.5V5.5" stroke="#BA3902" stroke-opacity="0.98" strokeWidth="10" strokeLinecap="round"/>
                </g>
                <g id="arm_idle">
                    <path id="Vector 7" d="M58 152C76.8404 167.5 79.8404 169.5 100.5 184.5" stroke="black" strokeWidth="5" strokeLinecap="round"/>
                    <path id="Vector 8" d="M246.84 152C229.84 166 226.84 168.5 204.34 184.5" stroke="black" strokeWidth="5" strokeLinecap="round"/>
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
                    <path id="mouth" d="M147 151.5C152.5 151.5 147.2 151.5 152 151.5C156.8 151.5 152.5 151.5 157 151.5" stroke="black" strokeWidth="5" strokeLinecap="round"/>
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