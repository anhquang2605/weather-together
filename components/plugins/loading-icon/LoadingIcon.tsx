import React, { useEffect } from 'react';
import style from './loading-icon.module.css';
import anime from 'animejs';
import { propertiesStagesAnimation } from '../../../libs/anime-animations-helpers';
interface LoadingIconProps {
    staggerDelay?: number
    duration?: number
}
const STAGGER_DELAY = 350;
const DURATION = 2000;
const LoadingIcon: React.FC<LoadingIconProps> = ({
    staggerDelay = STAGGER_DELAY,
    duration = DURATION
}) => {
    const startAnimation = () => {
       const anim = anime({
           targets: '.' + style['loading-icon__circle'],
           scale: [1, 1.75, 1],
           backgroundColor: ['#ffffff','#615FFF', '#ffffff'],
           duration: duration,
           direction: '',
           easing: 'linear',
           loop: true,
                      delay: anime.stagger(STAGGER_DELAY)
       });
/*        const anim2 = anime({
           targets: '.' + style['loading-icon__circle'],
          
           duration: duration,
           easing: 'linear',
           loop: true,
                      delay: anime.stagger(STAGGER_DELAY)
       }) */
       
    }
    useEffect(()=>{
        startAnimation();
    }, [])
    return (
        <div className={style['loading-icon']}>
            <div className={style['loading-icon__circle']}>
            </div>
            <div className={style['loading-icon__circle']}>
            </div>
            <div className={style['loading-icon__circle']}>
            </div>
        </div>
    );
};

export default LoadingIcon;