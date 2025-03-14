import React, { useEffect } from 'react';
import style from './sunny.module.css';
import anime, { AnimeAnimParams } from 'animejs';
import { propertiesStagesAnimation } from '../../../../libs/anime-animations-helpers';
import { time } from 'console';
import background from '../../../weather-widgets/weather-bar/animated-bar-background/background/Background';
import { be } from 'date-fns/locale';
interface SunnyProps {

}

const Sunny: React.FC<SunnyProps> = ({}) => {
    const sunnyAnimation = () => {
        const PATH_MOVE_IN_DISTANCE = 20;
        const timeline1 = anime.timeline({
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
        const sunPathUnfoldingAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path'] + ' path:not(:first-child)' , 'linear', 500, {
            rotate: 0,
        }, false);
        const testAnimation: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path'] + ' path:not(:first-child)' , 'linear', 1000, {
           stroke: '#fff'
        },false)
        //timeline.add(testAnimation);
        const sunPathMovingInAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path'] , 'easeInElastic', 1000, {
            complete: () => {
                const path = document.getElementById(style['sunny-sun_path']);
                if (path) {
                    path.style.opacity = '0';
                }

            },
            translateX: ['-' + PATH_MOVE_IN_DISTANCE],
        }, false);
        const sunPathMoveOutAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path'] , 'easeOutElastic', 1000, {
            translateX: [0],
            begin: () => {
                const path = document.getElementById(style['sunny-sun_path']);
                if (path) {
                    path.style.opacity = '1';
                }
            }
        }, false)
        const sunStrokeExpandingAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_stroke'] , 'easeOutElastic', 1000, {
            scale: [0, 1]
        },false)
        const sunFillExpandingAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-filled_sun'] , 'easeOutElastic', 1000, {
            scale: [0, 1]
        }, false)
        timeline1.add(sunStrokeExpandingAnime);
        timeline1.add(sunFillExpandingAnime);
        timeline1.add(sunPathSpinningAnime);
        timeline1.add(sunPathFoldingAnime);
        timeline1.add(sunPathMovingInAnime);
        timeline1.add(sunPathMoveOutAnime);
        timeline1.add(sunPathUnfoldingAnime);
    }
    useEffect(()=>{
        sunnyAnimation();
    },[])
    return (
        <div className={style['sunny']}>
            <svg width="60mm" height="60mm" version="1.1" viewBox="0 0 60 60"  xmlns="http://www.w3.org/2000/svg">
                <g stroke-linecap="round" stroke-width="1.3229">
                    <g  id={style["sunny-sun_path"]}  fill="none" stroke="#ffc60b">
                                    <path d="m47.128 30h8.0773"/>
                    <path d="m42.111 42.111 5.7115 5.7115"/>
                    <path d="m30 47.128v8.0773"/>
                    <path d="m17.889 42.111-5.7115 5.7115"/>
                    <path d="m12.872 30h-8.0773"/>
                    <path d="m17.889 17.889-5.7115-5.7115"/>
                    <path d="m30 12.872v-8.0773"/>
                    <path d="m42.111 17.889 5.7115-5.7115"/>
                    </g>
                    <circle id={style["sunny-sun_stroke"]} cx="30" cy="30" r="12.111" fill="none" stroke="#ffc60b" />
                    <circle id={style["sunny-filled_sun"]} cx="30" cy="29.981" r="12.111" fill="#fff57e"  />
                </g>
            </svg>
        </div>
    );
};

export default Sunny;