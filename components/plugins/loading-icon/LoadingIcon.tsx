import React, { useEffect } from 'react';
import style from './loading-icon.module.css';
import anime from 'animejs';
import { propertiesStagesAnimation } from '../../../libs/anime-animations-helpers';
interface LoadingIconProps {

}

const LoadingIcon: React.FC<LoadingIconProps> = ({}) => {
    const startAnimation = () => {
/*        const anim = anime({
           targets: '.' + style['loading-icon__circle'],
           scale: [1, 1.5],
           duration: 3000,
           direction: 'reverse',
           loop: true,
                      delay: anime.stagger(250)
       }); */
       const anim2 = anime({
           targets: '.' + style['loading-icon__circle'],
           backgroundColor: '#615FFF',
           duration: 3000,
           loop: true,
                      delay: anime.stagger(250)
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