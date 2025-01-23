import React, { useEffect } from 'react';
import style from './thunder-cloud.module.css';
import { SVGCloudPropType } from '../svg-cloud-types';

interface ThunderCloudProps extends SVGCloudPropType {};

const ThunderCloud: React.FC<ThunderCloudProps> = (props) => {
    const {
        duration = 2000,
        delay = 0,
        easing = 'linear'
    } = props
    const startAnimation = () => {

    }
    useEffect(() => {
        startAnimation();
    },[])
    return (
<div className={style['thunder-cloud']}>
<svg width="43.461mm" height="48.202mm" version="1.1" viewBox="0 0 43.461 48.202" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="filter5" x="-.48879" y="-.29104" width="2.0324" height="1.5821" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="1.5913299"/>
        </filter>
    </defs>
    <g transform="translate(-51.052 -25.084)">
        <g id="thunder-strike" fill="none" stroke="#ffea69" stroke-linecap="round">
            <path d="m73.762 52.823-5.8494 6.7929 10.661 3.3021-6.4155 3.6795 1.6039 2.0756" filter="url(#filter5)" stroke-width="1.5875" />
            <path d="m73.967 52.645-5.8494 6.7929 10.661 3.3021-6.4155 3.6795 1.6039 2.0756" stroke-width="1.323"/>
        </g>
        <path d="m87.088 34.607c0.09183-0.48812 0.13972-0.99176 0.13972-1.5068 0-4.4271-3.543-8.016-7.9136-8.016-2.6741 0-5.0385 1.3436-6.4709 3.4007-1.3753-1.1695-3.1491-1.8738-5.0851-1.8738-4.3286 0-7.8455 3.5203-7.9126 7.8887h-9.96e-4c-4.8561 0-8.7927 3.9875-8.7927 8.9066 0 4.919 3.9366 8.9066 8.7927 8.9066h25.876c4.856 0 8.7927-3.9876 8.7927-8.9066 0-4.4478-3.2185-8.1339-7.4251-8.7994z" fill="#222" stroke-width=".52363"/>
        <g stroke="#aaa4a4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3229">
            <g transform="translate(2.2844)" fill="#202020" >
                <path d="m63.306 42.978 5.0003 2.3586"/>
                <path d="m77.69 42.978-5.0003 2.3586"/>
            </g>
            <path d="m70.252 48.484s0.5515-1.368 2.4956-1.3208c1.9441 0.04717 2.565 1.3208 2.565 1.3208" fill="none" />
        </g>
    <path d="m72.08 51.701-7.7363 9.6233h15.284l-8.8685 7.5476" fill="none"/>
    </g>
</svg>
</div>
    );
};

export default ThunderCloud;