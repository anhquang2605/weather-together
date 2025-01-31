import React, { useEffect } from 'react';
import style from './snow-cloud.module.css';
import { SVGCloudPropType } from '../svg-cloud-types';
import anime from 'animejs';
import { propertiesStagesAnimation } from '../../../../../../../../libs/anime-animations-helpers';

interface SnowCloudProps extends SVGCloudPropType {

}

const SnowCloud: React.FC<SnowCloudProps> = (props) => {
    const {duration = 2000, delay = 0, easing = 'linear'} = props
    const startAnimation = () => {
        const timeline = anime.timeline({ delay: delay, loop: true});
        //snow flake animation
        const snowFlakeAnim:any = propertiesStagesAnimation('.' + style['snow-flake'], easing, duration, 
            {
                translateY: [-5, 0],
                scale: [0, 1]
            }, 
        false);
        //cloud-body animation

        //cloud animation
        
        //adding animation
        timeline.add(snowFlakeAnim);

    }   
    useEffect(() => {
        startAnimation();       
    },[])
    return (
        <div className={style['snow-cloud']}>
            <svg width="44.63mm" height="30.366mm" version="1.1" viewBox="0 0 44.63 30.366" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-51.052 -25.084)">
                <g id={style['cold-cloud-body']}>
                    <path id={style["cold-cloud"]} d="m87.088 34.607c0.09183-0.48812 0.13972-0.99176 0.13972-1.5068 0-4.4271-3.543-8.016-7.9136-8.016-2.6741 0-5.0385 1.3436-6.4709 3.4007-1.3753-1.1695-3.1491-1.8738-5.0851-1.8738-4.3286 0-7.8455 3.5203-7.9126 7.8887h-9.96e-4c-4.8561 0-8.7927 3.9875-8.7927 8.9066 0 4.919 3.9366 8.9066 8.7927 8.9066h25.876c4.856 0 8.7927-3.9876 8.7927-8.9066 0-4.4478-3.2185-8.1339-7.4251-8.7994z" fill="#fff" stroke-width=".52363"/>
                    <g id="cold-face">
                        <path d="m64.478 43.801s0.58181-1.1666 1.952-1.1133c1.5577 0.0606 1.0862 1.2419 2.5502 1.3344 1.2149 0.01084 1.8793-0.81756 1.8793-0.81756" fill="none" stroke="#202020" stroke-linecap="round" stroke-width="1.3229"/>
                        <path d="m75.28 43.801s0.58181-1.1666 1.952-1.1133c1.5577 0.0606 1.0862 1.2419 2.5502 1.3344 1.2149 0.01084 1.8793-0.81756 1.8793-0.81756" fill="none" stroke="#202020" stroke-linecap="round" stroke-width="1.3229"/>
                        <ellipse cx="73.07" cy="45.54" rx="1.1508" ry="1.0174" fill="#202020"/>
                    </g>
                </g>
  
                <g id="snow-flakes" fill="#202020" stroke="#00adce" stroke-linecap="round" stroke-width="1.3229">
                    <g id={style['snow-flake-1']} className={style['snow-flake']}>
                        <path d="m58.578 46.25v8.5392"/>
                        <path d="m54.309 50.519h8.5392"/>
                        <path d="m55.571 47.403 6.009 6.0671"/>
                        <path d="m61.421 47.405-6.009 6.0671"/>
                    </g>
                    <g id={style['snow-flake-2']} className={style['snow-flake']}>
                        <path d="m90.75 33.581v8.5392"/>
                        <path d="m86.481 37.85h8.5392"/>
                        <path d="m87.743 34.734 6.009 6.0671"/>
                        <path d="m93.593 34.736-6.009 6.0671"/>
                    </g>
                    <g id={style['snow-flake-3']} className={style['snow-flake']}>
                        <path d="m71.14 28.818v8.5392"/>
                        <path d="m66.871 33.087h8.5392"/>
                        <path d="m68.133 29.971 6.009 6.0671"/>
                        <path d="m73.983 29.973-6.009 6.0671"/>
                    </g>
                </g>
            </g>
            </svg>
        </div>
    );
};

export default SnowCloud;