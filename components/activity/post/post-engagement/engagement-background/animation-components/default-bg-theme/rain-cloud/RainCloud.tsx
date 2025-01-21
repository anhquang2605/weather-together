import React, { useEffect } from 'react';
import style from './rain-cloud.module.css';
import SVGWrapper from '../../../../svg-wrapper/SVGWrapper';
import { pathRevealAnimation, pathShrinkAnimation } from '../../../../../../../../libs/anime-animations-helpers'; 
import { SVGCloudPropType } from '../svg-cloud-types';

const RainCloud: React.FC<SVGCloudPropType> = (props) => {
    const {
        duration = 3000,
        delay = 0,
        easing = 'easeOut'
    } = props

    const targets =  '#rain-drops path';
    const startAnimation = () => {
        const anim = pathRevealAnimation(targets, 'easeOut', 3000);
        anim.play();
        
    }
    useEffect(()=> {
        const rainDropsElements = document.getElementById('rain-drops');
        if(rainDropsElements) {
            startAnimation();
        }
    },[])
    return (
        <div className={style['rain-cloud']}>
            <SVGWrapper fileName='rain-cloud'/>
        </div>
    );
};

export default RainCloud;