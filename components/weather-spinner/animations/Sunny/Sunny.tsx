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
    //CONSTANTS
    const SUN_SPIN_DURATION = 2000;
    const SUN_SIZE_CHANGE_DURATION = 1000;
    const SUN_TRANSLATION_DURATION = 1000;
    const SUN_PATH_FOLDING_DURATION = 500;
    const SUN_SIZE_DURATION_OFFSET_MULTIPLIER = 0.7;
    const SUN_SIZE_DURATION_OFFSET = SUN_SIZE_CHANGE_DURATION * SUN_SIZE_DURATION_OFFSET_MULTIPLIER; 
    const sunnyAnimation = () => {
        const PATH_MOVE_IN_DISTANCE = 20;
        const timeline1 = anime.timeline({
            //loop: true,
            changeBegin: () => {
                
            }
        });
        const sunPathFoldingAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path'] + ' path:not(:first-child)' , 'linear', SUN_PATH_FOLDING_DURATION, {
            rotate: anime.stagger([315, 45 ]),
        }, false);
        const sunPathSpinningAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path']  , 'linear', SUN_SPIN_DURATION, {
            rotate: 360,
        },false)
        const sunPathUnfoldingAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path'] + ' path:not(:first-child)' , 'linear', SUN_PATH_FOLDING_DURATION, {
            rotate: 0,
        }, false);
        //timeline.add(testAnimation);
        const sunPathMovingInAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path'] , 'easeInElastic', SUN_TRANSLATION_DURATION, {
            changeComplete: () => {
                const path = document.getElementById(style['sunny-sun_path']);
                if (path) {
                    path.style.opacity = '0';
                }

            },
            translateX: ['-' + PATH_MOVE_IN_DISTANCE],
            scaleX: 0.5,
            scaleY: 1.6,
        }, false);
        const sunPathMoveOutAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_path'] , 'easeOutElastic', SUN_TRANSLATION_DURATION, {
            translateX: [0],
            scaleX: 1,
            scaleY: 1,
            begin: () => {
                const path = document.getElementById(style['sunny-sun_path']);
                if (path) {
                    path.style.opacity = '1';
                }
            }
        }, false)
        const sunStrokeExpandingAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_stroke'] , 'easeOutElastic', SUN_SIZE_CHANGE_DURATION, {
            scale: [0, 1]
        },false)
        const sunFillExpandingAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-filled_sun'] , 'easeOutElastic', SUN_SIZE_CHANGE_DURATION, {
            scale: [0, 1],
        }, false)
        const sunStrokeShrinkingAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-sun_stroke'] , 'easeInElastic', SUN_SIZE_CHANGE_DURATION, {
            scale: [1, 0]
        }, false)
        const sunFillShrinkingAnime: AnimeAnimParams = propertiesStagesAnimation('#' + style['sunny-filled_sun'] , 'easeInElastic', SUN_SIZE_CHANGE_DURATION, {
            scale : [1, 0]
        }, false)
        timeline1.add(sunStrokeExpandingAnime);
        timeline1.add(sunFillExpandingAnime, `-=${SUN_SIZE_DURATION_OFFSET}`);
        timeline1.add(sunPathMoveOutAnime); 
        timeline1.add(sunPathUnfoldingAnime); 
        timeline1.add(sunPathSpinningAnime);
        timeline1.add(sunPathFoldingAnime);
        timeline1.add(sunPathMovingInAnime);
        timeline1.add(sunStrokeShrinkingAnime);
        timeline1.add(sunFillShrinkingAnime, `-=${SUN_SIZE_DURATION_OFFSET}`);
        //restarting point here


    }
    const setUp = () => {
        const paths = document.querySelectorAll('#' + style['sunny-sun_path'] + ' path') as NodeListOf<SVGElement>;
        const numberOfPaths = paths ? paths.length : 0;
        if (numberOfPaths) {
            const angle = 360 / numberOfPaths;
            for (let i = numberOfPaths - 1; i > 0; i--) {
                const pathNo = numberOfPaths - i;
                const thePath = paths[pathNo] as SVGElement;
                
                thePath.style.transform = `rotate(${i * angle }deg)`;
                                }
        }
    }
    useEffect(()=>{
        setUp();
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
                    <circle id={style["sunny-filled_sun"]} cx="30" cy="30" r="11.5" fill="#fff57e" stroke="none"  />
                </g>
            </svg>
        </div>
    );
};

export default Sunny;