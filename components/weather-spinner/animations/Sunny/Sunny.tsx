import React, { useEffect } from 'react';
import style from './sunny.module.css';
import anime, { AnimeAnimParams } from 'animejs';
import { propertiesStagesAnimation } from '../../../../libs/anime-animations-helpers';
import { time } from 'console';
interface SunnyProps {

}

const Sunny: React.FC<SunnyProps> = ({}) => {
    const sunnyAnimation = () => {
        const timeline = anime.timeline({
            //loop: true
        });
        const sunPathFoldingAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path'] + ' path:nth-child(n + 1)' , 'linear', 1000, {
            rotate: anime.stagger([360, 45]),
        }, false);
        const sunPathUnfoldingAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path'] + ' path:nth-child(n + 1)' , 'linear', 1000, {
            rotate: anime.stagger([0, -45]),
        }, false)
        //sunPathFoldingAnime.delay = anime.stagger(100);
        timeline.add(sunPathFoldingAnime);
        timeline.add(sunPathUnfoldingAnime);
        
    }
    useEffect(()=>{
        sunnyAnimation();
    },[])
    return (
        <div className={style['sunny']}>
            <svg width="51.734mm" height="51.734mm" version="1.1" viewBox="0 0 51.734 51.734" xmlns="http://www.w3.org/2000/svg">
                <g stroke-linecap="round" stroke-width="1.3229">
                <g transform="translate(-15.314 -1.5432)" id={style["sunny-sun_path"]}  fill="none" stroke="#ffc60b">
                    <path d="m58.309 27.41h8.0773"/>
                    <path d="m53.292 39.521 5.7115 5.7115"/>
                    <path d="m41.181 44.538v8.0773"/>
                    <path d="m29.07 39.521-5.7115 5.7115"/>
                    <path d="m24.053 27.41h-8.0773"/>
                    <path d="m29.07 15.299-5.7115-5.7115"/>
                    <path d="m41.181 10.282v-8.0773"/>
                    <path d="m53.292 15.299 5.7115-5.7115"/>
                </g>
                    <circle id={style["sunny-sun_stroke"]} cx="25.867" cy="25.867" r="12.111" fill="none" stroke="#000" />
                    <circle id={style["sunny-filled_sun"]} cx="25.867" cy="25.848" r="12.111" fill="#fff57e" stroke="#ffc60b" />
                </g>
            </svg>
        </div>
    );
};

export default Sunny;