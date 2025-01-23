import React, { useEffect } from 'react';
import styles from './rain-cloud.module.css';
import SVGWrapper from '../../../../svg-wrapper/SVGWrapper';
import { pathRevealAnimation, pathShrinkAnimation } from '../../../../../../../../libs/anime-animations-helpers'; 
import { SVGCloudPropType } from '../svg-cloud-types';
import anime from 'animejs';

const RainCloud: React.FC<SVGCloudPropType> = (props) => {
    const {
        duration = 2000,
        delay = 0,
        easing = 'linear'
    } = props

    const targets =  '#rain-drops path';
    const startAnimation = () => {
  /*       const anim = pathRevealAnimation(targets, easing, duration); */
        const anim2 = anime({
            targets: targets,
            strokeDasharray: [[0],[4]],
            easing: easing,
            duration: duration,
            delay: anime.stagger(500, {from: 'center'}),
            

        })
        
    }
    useEffect(()=> {
  /*       const rainDropsElements = document.getElementById('rain-drops');
        console.log(rainDropsElements);
        if(rainDropsElements) { */
            startAnimation();
/*         } */
    },[])
    return (
        <div className={styles['rain-cloud']}>


<svg width="43.461mm" height="40.682mm" version="1.1" viewBox="0 0 43.461 40.682" xmlns="http://www.w3.org/2000/svg">
 <g transform="translate(-51.052 -25.084)">
  <g id="rain-boy">
   <g id="rain-drops" fill="#9f9f9f" stroke="#6597d9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3229">
    <path d="m86.643 45.891v19.213"/>
    <path d="m77.226 45.891v19.213"/>
    <path d="m67.808 45.891v19.213"/>
    <path d="m58.391 45.891v19.213"/>
   </g>
   <path id="rain-cloud" d="m87.088 34.607c0.09183-0.48812 0.13972-0.99176 0.13972-1.5068 0-4.4271-3.543-8.016-7.9136-8.016-2.6741 0-5.0385 1.3436-6.4709 3.4007-1.3753-1.1695-3.1491-1.8738-5.0851-1.8738-4.3286 0-7.8455 3.5203-7.9126 7.8887h-9.96e-4c-4.8561 0-8.7927 3.9875-8.7927 8.9066 0 4.919 3.9366 8.9066 8.7927 8.9066h25.876c4.856 0 8.7927-3.9876 8.7927-8.9066 0-4.4478-3.2185-8.1339-7.4251-8.7994z" fill="#333" stroke-width=".52363"/>
   <g id="rain-face" stroke="#9f9f9f" stroke-linecap="round" stroke-linejoin="round">
    <g id="rain-eyes" transform="translate(.75476 .75476)" fill="#fff" stroke-width=".79375">
     <path id="rain-left-eye" d="m63.4 41.323h6.9816"/>
     <path id="rain-right-eye" d="m73.881 41.258h6.9816"/>
    </g>
    <path id="rain-mouth" d="m71.846 44.343a0.91728 0.89628 0 0 1 0.94927-0.84945 0.91728 0.89628 0 0 1 0.88386 0.91436 0.91728 0.89628 0 0 1-0.92206 0.8776 0.91728 0.89628 0 0 1-0.91224-0.88735" fill="#9f9f9f" stroke-width=".069053"/>
   </g>
  </g>
 </g>
</svg>


        </div>
    );
};

export default RainCloud;