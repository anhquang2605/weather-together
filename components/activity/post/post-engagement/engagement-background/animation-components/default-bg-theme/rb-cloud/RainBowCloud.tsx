import React, { useEffect } from 'react';
import style from './rainbow-cloud.module.css';
import { SVGCloudPropType } from '../svg-cloud-types';
import { pathRevealAnimation } from '../../../../../../../../libs/anime-animations-helpers';
import anime from 'animejs';

interface RainBowCloudProps extends SVGCloudPropType{

}


const RainBowCloud: React.FC<RainBowCloudProps> = (props) => {
    const {
        duration = 2000,
        delay = 0,
        easing = 'easeInSine'
    } = props
    const startAnimation = () => {
        const timeline = anime.timeline();
        //setting up variables
        const anim:any = pathRevealAnimation('#rainbow path', easing, duration, false);
        anim.delay = anime.stagger(200);
        timeline.add(anim);

    }
    useEffect(()=> {
        startAnimation();
    },[])
    return (
    <div className={style['rainbow-cloud']}>
        <svg width="44.038mm" height="33.525mm" version="1.1" viewBox="0 0 44.038 33.525" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id="clipPath3">
                <rect x="66.41" y="65.881" width="43.461" height="27.229" fill="#fff" stroke-width=".52363"/>
                </clipPath>
            </defs>
            <g transform="translate(-85.104 -140.97)">
                <g id="rb-cloud">
                    <g id="rainbow" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8521">
                        <path d="m88.153 161.97s-2.6932-10.535 6.2958-16.133c9.3945-5.8505 17.575 2.2623 17.575 2.2623" stroke="#e0c838"/>
                        <path d="m90.607 163.14s-4.6266-9.5985 4.4457-15.561c8.5561-5.623 16.213 2.3285 16.213 2.3285" stroke="#33ce5c"/>
                        <path d="m91.712 161.67s-3.0452-9.0909 5.4346-13.339c7.0092-3.5115 12.703 2.5737 12.703 2.5737" stroke="#8968da"/>
                        <path d="m86.414 163.13s-2.9175-13.176 7.3121-19.002c11.547-6.5766 19.977 3.3674 19.977 3.3674" stroke="#e06838"/>
                    </g>
                    <path id="rainbow-cloud" transform="translate(19.27 81.384)" d="m102.45 75.404c0.0918-0.48813 0.13971-0.99175 0.13971-1.5068 0-4.4271-3.543-8.0159-7.9136-8.0159-2.6741 0-5.0385 1.3436-6.4709 3.4007-1.3753-1.1695-3.1491-1.8738-5.0851-1.8738-4.3286 0-7.8455 3.5203-7.9126 7.8886h-9.95e-4c-4.8561 0-8.7927 3.9875-8.7927 8.9066 0 4.919 3.9366 8.9066 8.7927 8.9066h25.876c4.856 0 8.7927-3.9876 8.7927-8.9066 0-4.4478-3.2185-8.1339-7.4251-8.7994z" clip-path="url(#clipPath3)" fill="#fff" stroke-width=".52363"/>
                    <g id="rb-face">
                        <g id="rb-eyes" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".79375">
                            <path id="rb-left-eye" d="m101.8 161.72 3.4611 1.4967-3.2859 1.8971"/>
                            <path id="rb-right-eye" d="m112.8 161.72-3.4611 1.4967 3.2859 1.8971"/>
                        </g>
                        <path id="rb-mouth" d="m108.94 164.71a1.5457 2.1722 0 0 1-1.538 2.1721 1.5457 2.1722 0 0 1-1.5533-2.1505" fill="#363636"/>
                    </g>
                </g>
            </g>
        </svg>
    </div>
    );
};

export default RainBowCloud;