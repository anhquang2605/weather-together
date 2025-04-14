import React, { use, useEffect } from 'react';
import styles from './cloudy.module.css';
import anime from 'animejs';

interface CloudyProps {

}

const Cloudy: React.FC<CloudyProps> = ({}) => {
    const startAnimation = () => {
        const timeline = anime.timeline({});
        //rain animation

    }
    const setUp = () => {
        
    }
    useEffect(() => {
        
    },[])
    return (
        <div className={styles['cloudy']}>
            <svg width="50mm" height="40mm" version="1.1" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg">
                <path id={styles["cloud-filled"]} d="m40.94 22.547-28.469-0.19862c-2.2069-0.0154-3.9936-3.0653-3.9063-5.6939 0.18141-5.4599 3.3137-7.5398 4.6345-8.5408 1.7614-1.3348 5.8669-2.093 8.2097-1.5228 2.9774 0.72471 5.2479 2.5839 6.9518 4.767 2.1686 2.7783 1.589 4.4359 1.589 4.4359 0.97762-2.7787 3.9083-4.4654 6.8856-4.5021 3.0538-0.03771 4.9238 1.6992 6.2897 4.2373 1.1794 2.2147 1.0703 6.8856-2.1849 7.018z" fill="#5300d4"/>
                <g id={styles['cloudy-rain']} fill="none" stroke="#4eb0e8" stroke-linecap="round" stroke-width="1.3229">
                    <path d="m13.664 22.414-7.4815 11.057"/>
                    <path d="m26.773 22.514-7.4815 11.057"/>
                    <path d="m39.882 22.547-7.4815 11.057"/>
                </g>
                <path id="cloud-stroke" d="m40.94 22.547-28.469-0.19862c-2.2069-0.0154-3.9936-3.0653-3.9063-5.6939 0.18141-5.4599 3.3137-7.5398 4.6345-8.5408 1.7614-1.3348 5.8669-2.093 8.2097-1.5228 2.9774 0.72471 5.2479 2.5839 6.9518 4.767 2.1686 2.7783 1.589 4.4359 1.589 4.4359 0.97762-2.7787 3.9083-4.4654 6.8856-4.5021 3.0538-0.03771 4.9238 1.6992 6.2897 4.2373 1.1794 2.2147 1.0703 6.8856-2.1849 7.018z" fill="none" stroke="#7200ec" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3229" />
            </svg>
        </div>
    );
};

export default Cloudy;


