import React, { useEffect } from 'react';
import style from './sunny.module.css';
import anime, { AnimeAnimParams } from 'animejs';
import { propertiesStagesAnimation } from '../../../../libs/anime-animations-helpers';
import { time } from 'console';
import background from '../../../weather-widgets/weather-bar/animated-bar-background/background/Background';
interface SunnyProps {

}

const Sunny: React.FC<SunnyProps> = ({}) => {
    const sunnyAnimation = () => {
        const timeline = anime.timeline({
            //loop: true,
          /*   begin: () => {
                const paths = document.querySelectorAll('#' + style['sunny-sun_path'] + ' path') as NodeListOf<SVGElement>;
                const numberOfPaths = paths ? paths.length : 0;
                if (numberOfPaths) {
                    const angle = 360 / numberOfPaths;
                    for (let i = numberOfPaths - 1; i > 0; i--) {
                        const thePath = paths[i] as SVGElement;
                        console.log(i * angle);
                        thePath.style.transform = `rotate(${i * angle }deg)`;
                    }
                }
            } */
        });
        const sunPathFoldingAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path'] + ' path:not(:first-child)' , 'linear', 500, {
            rotate: anime.stagger([315, 45 ]),
        }, false);
        const sunPathSpinningAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path']  , 'linear', 2000, {
            rotate: 360,
        },false)
        const sunPathUnfoldingAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path'] + ' path:not(:first-child)' , 'linear', 1000, {
            rotate: 0,
        }, false);
        const testAnimation: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path'] + ' path:not(:first-child)' , 'linear', 1000, {
           stroke: '#fff'
        },false)
        //timeline.add(testAnimation);
        const sunPathMovingInAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path'] , 'linear', 1000, {
            translateX: ['-100%']
        }, false);

        timeline.add(sunPathSpinningAnime);
        timeline.add(sunPathFoldingAnime);
        timeline.add(sunPathMovingInAnime);
        //timeline.add(sunPathUnfoldingAnime);
        
    }
    useEffect(()=>{
        sunnyAnimation();
    },[])
    return (
        <div className={style['sunny']}>
            <svg width="51.734mm" height="51.734mm" version="1.1" viewBox="0 0 51.734 51.734" xmlns="http://www.w3.org/2000/svg">
                <g stroke-linecap="round" stroke-width="1.3229">
                <g  id={style["sunny-sun_path"]}  fill="none" stroke="#ffc60b">
                    <path d="m42.995 25.867h8.0773"/>
                    <path d="m37.978 37.978 5.7115 5.7115"/>
                    <path d="m25.867 42.995v8.0773"/>
                    <path d="m13.756 37.978-5.7115 5.7115"/>
                    <path d="m8.739 25.867h-8.0773"/>
                    <path d="m13.756 13.756-5.7115-5.7115"/>
                    <path d="m25.867 8.7388v-8.0773"/>
                    <path d="m37.978 13.756 5.7115-5.7115"/>
                </g>
                    <circle id={style["sunny-sun_stroke"]} cx="25.867" cy="25.867" r="12.111" fill="none" stroke="#000" />
                    <circle id={style["sunny-filled_sun"]} cx="25.867" cy="25.848" r="12.111" fill="#fff57e" stroke="#ffc60b" />
                </g>
            </svg>
        </div>
    );
};

export default Sunny;