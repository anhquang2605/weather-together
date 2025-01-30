import React, { useEffect } from 'react';
import style from './sun-cloud.module.css';
import { SVGCloudPropType } from '../svg-cloud-types';
import anime from 'animejs';

interface SunCloudProps extends SVGCloudPropType {

}

const SunCloud: React.FC<SunCloudProps> = (props) => {
    const { duration = 2000, delay = 0 } = props
    const startAnimation = () => {
        const timeline = anime.timeline();
        
    }
    useEffect(()=>{
        startAnimation();
    },[])
    return (
        <div className={style['sun-cloud']}>
            <svg width="47.47mm" height="34.219mm" version="1.1" viewBox="0 0 47.47 34.219" xmlns="http://www.w3.org/2000/svg">
                <g id={style["sun-cloud"]} transform="translate(-52.743,-18.094)">
                    <g id="the-sun" transform="translate(-12.359,12.171)" fill="#ffc221">
                    <circle id={style["bg-sun"]} cx="99.252" cy="17.548" r="6.5098"/>
                    <g id={style["sun-beam"]} stroke="#ffc221" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3229">
                        <path d="m86.593 17.548h4.1512"/>
                        <path d="m92.922 28.511c2.0756-3.595 2.0756-3.595 2.0756-3.595"/>
                        <path d="m105.58 28.511c-2.0756-3.595-2.0756-3.595-2.0756-3.595"/>
                        <path d="m92.922 6.5853c2.0756 3.5951 2.0756 3.5951 2.0756 3.5951"/>
                        <path d="m105.58 6.5853-2.0756 3.5951"/>
                        <path d="m111.91 17.548h-4.1512"/>
                    </g>
                    </g>
                    <path id={style["the-sun-cloud"]} d="m88.779 34.607c0.09183-0.48812 0.13972-0.99176 0.13972-1.5068 0-4.4271-3.543-8.016-7.9136-8.016-2.6741 0-5.0385 1.3436-6.4709 3.4007-1.3753-1.1695-3.1491-1.8738-5.0851-1.8738-4.3286 0-7.8455 3.5203-7.9126 7.8887h-9.96e-4c-4.8561 0-8.7927 3.9875-8.7927 8.9066 0 4.919 3.9366 8.9066 8.7927 8.9066h25.876c4.856 0 8.7927-3.9876 8.7927-8.9066 0-4.4478-3.2185-8.1339-7.4251-8.7994z" fill="#fff" stroke-width=".52363"/>
                    <g id={style['sun-face']} stroke="#000" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="64.244" y="40.445" width="7.1572" height="2.7029" stroke-width="1.0529"/>
                        <rect x="74.302" y="40.445" width="7.1572" height="2.7029" stroke-width="1.0529"/>
                        <path d="m71.282 41.829h3.6358" stroke-width=".79375"/>
                        <path d="m72.427 45.577s0.91058 0.44726 1.7317 0.03188c0.82108-0.41538 0.71562-1.1087 0.71562-1.1087" fill="none" stroke-width=".79375"/>
                    </g>
                <path id={style['"glasses-spark"']} d="m82.642 42.189-1.193-1.5176-1.911 0.19351 1.5176-1.193-0.19351-1.911 1.193 1.5176 1.911-0.19351-1.5176 1.193z" fill="#f2ff12" stroke="#f2ff12" stroke-linecap="round" stroke-linejoin="round" stroke-width=".58692"/>
                </g>
            </svg>
        </div>
    );
};

export default SunCloud;