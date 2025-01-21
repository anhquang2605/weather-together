import React, { useEffect } from 'react';
import style from './rain-cloud.module.css';
import SVGWrapper from '../../../../svg-wrapper/SVGWrapper';
import { pathRevealAnimation, pathShrinkAnimation } from '../../../../../../../../libs/anime-animations-helpers'; 
import { SVGCloudPropType } from '../svg-cloud-types';
import anime from 'animejs';

const RainCloud: React.FC<SVGCloudPropType> = (props) => {
    const {
        duration = 3000,
        delay = 0,
        easing = 'linear'
    } = props

    const targets =  '#rain-drops path';
    const startAnimation = () => {
  /*       const anim = pathRevealAnimation(targets, easing, duration); */
        const anim2 = anime({
            targets: targets,
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: easing,
            duration: duration,
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
        <div className={style['rain-cloud']}>
            <SVGWrapper fileName='rain-cloud'/>
        </div>
    );
};

export default RainCloud;