import React, { useEffect } from 'react';
import style from './loading-icon.module.css';
import anime from 'animejs';
import { propertiesStagesAnimation } from '../../../libs/anime-animations-helpers';
interface LoadingIconProps {

}

const LoadingIcon: React.FC<LoadingIconProps> = ({}) => {
    const startAnimation = () => {
       const anim = anime({
           targets: '.' + style['loading-icon__circle'],
           scale: [1, 1.45, 1],
           backgroundColor: ['#fff ','#B1F4E7', '#fff'],
           duration: 3000,
           loop: true,
                      delay: anime.stagger(200)
       });
       
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