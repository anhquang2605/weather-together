import React, { useEffect } from 'react';
import style from './loading-icon.module.css';
import anime from 'animejs';
interface LoadingIconProps {

}

const LoadingIcon: React.FC<LoadingIconProps> = ({}) => {
    const startAnimation = () => {

    
    }
    useEffect(()=>{

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