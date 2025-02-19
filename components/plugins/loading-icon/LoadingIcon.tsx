import React, { useEffect } from 'react';
import style from './loading-icon.module.css';
import anime from 'animejs';
import { propertiesStagesAnimation } from '../../../libs/anime-animations-helpers';
interface LoadingIconProps {

}
const STAGGER_DELAY = 250;
const LoadingIcon: React.FC<LoadingIconProps> = ({}) => {
    const startAnimation = () => {
       const anim = anime({
           targets: '.' + style['loading-icon__circle'],
           scale: [0.8, 1.5, 0.8],
           duration: 3000,
           direction: '',
           easing: 'linear',
           loop: true,
                      delay: anime.stagger(STAGGER_DELAY)
       });
       const anim2 = anime({
           targets: '.' + style['loading-icon__circle'],
           backgroundColor: ['#ffffff','#615FFF', '#ffffff'],
           duration: 3000,
           easing: 'linear',
           loop: true,
                      delay: anime.stagger(STAGGER_DELAY)
       })
       
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