import React, { useEffect, useState } from 'react';
import styles from './happy-moon.module.css';

interface HappyMoonProps {
    isAnimated: boolean;
}

const HappyMoon: React.FC<HappyMoonProps> = ({isAnimated}:HappyMoonProps) => {
    const [speed, setSpeed] = useState(1);
    const greeting = () => {
        spin();
    }
    const glow = () => {

    }
    const wave = () => {

    }
    const squint = () => {

    }
    const spin = () => {
        const theFace = document.getElementById('the-face');
        if(theFace){
            theFace.style.transform = "translateX(0)";
        }
    }
    const armToggle = () => {

    }
    useEffect(()=>{
        if(isAnimated){
            greeting();
        }else{

        }
    },[isAnimated])
    return (
        <div className={styles['happy-moon']}>
            <svg width="35%"  viewBox="0 0 405 405" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="moon" clip-path="url(#clip0_0_1)">
                <circle id="second-radiant" cx="202.5" cy="202.5" r="202.5" fill="#FAE62D" fill-opacity="0.13"/>
                <circle id="first-radiant" cx="204.5" cy="202.5" r="177.5" fill="#FAE62D" fill-opacity="0.13"/>
                <g id="arm group">
                    <path id="higher-arm" d="M23.656 193.359C18.3315 191.892 12.8261 195.019 11.3592 200.344C9.89229 205.668 13.0195 211.174 18.344 212.641L23.656 193.359ZM67.8989 205.548L23.656 193.359L18.344 212.641L62.5869 224.83L67.8989 205.548Z" fill="#3B1212"/>
                    <path id="lower-arm" d="M21.9439 116.951C21.3596 111.459 16.434 107.48 10.9421 108.065C5.45028 108.649 1.47187 113.574 2.05611 119.066L21.9439 116.951ZM17 165.008L26.9478 163.988L26.9459 163.969L26.9439 163.951L17 165.008ZM30.9478 202.988L26.9478 163.988L7.05219 166.029L11.0522 205.029L30.9478 202.988ZM26.9439 163.951L21.9439 116.951L2.05611 119.066L7.05611 166.066L26.9439 163.951Z" fill="#3B1212"/>
                </g>
                <ellipse id="dark body" cx="202.5" cy="202" rx="148.5" ry="150" fill="#FCC000"/>
                <g id="light-body">
                    <mask id="mask0_0_1" className={styles['mask-alpha']} maskUnits="userSpaceOnUse" x="65" y="66" width="275" height="275">
                    <circle id="Ellipse 8" cx="202.5" cy="203.5" r="137.5" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_0_1)">
                        <g id="moon_2">
                            <rect id="Rectangle 1" x="47" y="32" width="712" height="345" fill="#FAE62D"/>
                            <circle id="Ellipse 8_2" cx="253.5" cy="72.5" r="6.5" fill="#FCC000"/>
                            <circle id="Ellipse 11" cx="264.5" cy="307.5" r="12.5" fill="#FCC000"/>
                            <circle id="Ellipse 18" cx="146" cy="269" r="31" fill="#FCC000"/>
                            <circle id="Ellipse 17" cx="100" cy="145" r="15" fill="#FCC000"/>
                            <circle id="Ellipse 13" cx="287" cy="191" r="13" fill="#FCC000"/>
                            <circle id="Ellipse 10" cx="251.5" cy="329.5" r="21.5" fill="#FCC000"/>
                        </g>
                    </g>
                </g>
                <mask id="mask1_0_1" className={styles['mask-alpha']} maskUnits="userSpaceOnUse" x="54" y="168" width="300" height="68">
                <rect id="Rectangle 3" x="54" y="168" width="300" height="68" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask1_0_1)">
                    <g style={{
                        transform: 'translateX(-300px)'
                    }} id="the-face">
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