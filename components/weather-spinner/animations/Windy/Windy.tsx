import React, { useEffect } from 'react';
import style from './windy.module.css';
import anime from 'animejs';
import { set } from 'lodash';
import { multiPathLengthShrinkForwardAnimation, pathRevealAnimation, pathShrinkAnimation, pathShrinkForwardAnimation, propertiesStagesAnimation } from '../../../../libs/anime-animations-helpers';
interface WindyProps {

}

const Windy: React.FC<WindyProps> = ({}) => {
    const setUp = () => {
        const leaves: NodeListOf<HTMLElement> = document.querySelectorAll(`.${style['leaves']}`);
        if (leaves) {
            leaves.forEach((leaf) => {
                //leaf.style.transform = 'scale(0)';
            });
        }
        const ringStroke: HTMLElement | null = document.getElementById(`${style["wind_stroke_ring"]}`);
        if (ringStroke) {
          ringStroke.style.transform = 'scale(0)';
        }

    }
    const startAnimation = () => {
        const RING_STROKE_DURATION = 750;
        const LEAVES_DURATION = 3000;
        const LEAVES_DELAY = 200;
        const WIND_PATH_DURATION = 2000;
        const timeline = anime.timeline({
        });
        //wind ring scale expansion animation
        const ringStroke: HTMLElement | null = document.getElementById(`${style["wind_stroke_ring"]}`);
        if (ringStroke) {
            const ringStrokeAnimation: any = propertiesStagesAnimation(`#${style["wind_stroke_ring"]}`, 'easeInQuad', RING_STROKE_DURATION, {
                scale: [0, 1],
                changeComplete: () => {
                    const ring = document.getElementById(`${style["wind_stroke_ring"]}`);
                    if (ring) {
                        ring.style.opacity = '0';
                    }        
                },
            }, false);
            timeline.add(ringStrokeAnimation);
        }
        //wind path animation expansion
        const windPathExpandingAnimation: any = pathRevealAnimation(`.${style['windy_path']} path`, 'easeInExpo', WIND_PATH_DURATION, false);
        timeline.add(windPathExpandingAnimation);
        //
        const windPathSameDirectionShrunkAnimations: any[] = multiPathLengthShrinkForwardAnimation(`.${style['windy_path']} path`, 'easeInExpo', WIND_PATH_DURATION);
        for (const anim of windPathSameDirectionShrunkAnimations) {
            timeline.add(anim, '-= ' + WIND_PATH_DURATION);
        }
       
        //wind path animation shrunken
        const windPathShrinkingAnimation: any = pathShrinkAnimation(`.${style['windy_path']} path`, 'easeInExpo', WIND_PATH_DURATION, false);
        //timeline.add(windPathShrinkingAnimation);

        //leaves animation
        const leavesAnimations: any = [];
        const leaves: NodeListOf<HTMLElement> = document.querySelectorAll(`.${style['leaves']}`);
        const pathNames = [];
        for (let i = 0; i < leaves.length; i++) {
            pathNames.push(`#${style[`wind_path_${i + 1}`]}`);
        }
        const paths: any = [];
        for (let i = 0; i < pathNames.length; i++) {
            paths.push(anime.path(pathNames[i]));
        }
        if (leaves) {
            const svg = document.querySelector(`.${style['windy']}`);
            
            if (svg) {
                leaves.forEach((leaf, index) => {
                leavesAnimations.push(propertiesStagesAnimation(`#leave_${index + 1}`, 'easeInExpo', LEAVES_DURATION,
                        {                 
                           translateX: paths[index]('x'),
                           translateY: paths[index]('y'),
                           rotate: paths[index]('angle'),
                           scale: [0, 1.2],
                           changeComplete: () => {
                            const leaf = document.querySelector(`#leave_${index + 1} svg`);
                            if (leaf) {
                                leaf.classList.add(style['leave_floating']);
                            }
                           }
                        } 
                        ,false));
                });
                for (let i = 0; i < leavesAnimations.length; i++) {
                    timeline.add(leavesAnimations[i], LEAVES_DELAY * i);
                }
            }
            
        }

        
    }

    useEffect(() => {
        setUp();
        startAnimation();
    },[])
    return (
        <div className={style['windy']}>
            <svg  width="60mm" height="60mm" version="1.1" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <g className={style['windy_path']} fill="none" stroke="#00eab5" stroke-linecap="round" stroke-width=".52917">
            <path id={style['wind_path_1']} d="m30.47 31.209c-6.5e-5 -3.2e-5 4.6e-5 -1.97e-4 6e-5 -2.13e-4 9.33e-4 -9.77e-4 0.0028 4.66e-4 0.0033 0.0011 0.0051 0.0065-0.0033 0.01549-0.0084 0.01834-0.02906 0.01637-0.06062-0.01584-0.07067-0.04013-0.03911-0.09459 0.05798-0.18357 0.13923-0.20878 0.25065-0.07771 0.46528 0.16979 0.51657 0.38944 0.13429 0.57492-0.42229 1.0364-0.93403 1.1259-1.1853 0.20714-2.0936-0.92939-2.2305-1.9977-0.28837-2.2508 1.8614-3.917 3.9108-4.102 4.0036-0.36132 6.8903 3.4604 7.1068 7.1371 0.39754 6.7528-6.0562 11.521-12.303 11.724-10.898 0.35366-18.466-10.085-18.567-20.228-0.071096-7.1809 3.1186-14.09 8.1747-19.112" stroke-width=".52917"/>
            <path id={style['wind_path_2']} d="m30.467 31.21c2.5e-5 4e-6 1e-5 7.1e-5 7e-6 8.1e-5 -1.21e-4 3.65e-4 -9.05e-4 2.32e-4 -9.67e-4 6e-5 -0.0019-0.0011-9.67e-4 -0.0041 8.1e-5 -0.0054 0.0054-0.0068 0.01617-0.0024 0.02093 0.0024 0.01842 0.01819 0.0049 0.04839-0.01167 0.06238-0.04975 0.04213-0.1229 7e-3 -0.15622-0.03828-0.08594-0.11683-0.0058-0.27503 0.10118-0.34508 0.24547-0.16077 0.55879 5e-3 0.69301 0.23112 0.28102 0.47348-0.03578 1.052-0.47455 1.2912-0.8535 0.46541-1.8622-0.10301-2.2649-0.89813-0.73752-1.4564 0.23032-3.1332 1.5935-3.7798 2.3744-1.1264 5.0518 0.45079 6.0504 2.6827 1.6675 3.7257-0.8083 7.8557-4.324 9.3489-5.6575 2.4031-11.842-1.3607-14.011-6.7169-3.3837-8.3523 2.1805-17.373 10.112-20.451 12.029-4.668 24.891 3.3587 29.166 14.813 1.5967 4.2796 2.0917 8.9333 1.5411 13.462" stroke-width=".529"/>
            <path id={style['wind_path_3']} d="m30.467 31.21c-1.4e-5 2.1e-5 -6.8e-5 -2.3e-5 -7.6e-5 -3.1e-5 -2.68e-4 -2.75e-4 2.08e-4 -9.11e-4 3.9e-4 -8.86e-4 0.0019-0.0012 0.0041 1e-3 0.0048 0.0026 0.0036 0.0079-0.0053 0.01544-0.01175 0.0175-0.02461 8e-3 -0.04525-0.01784-0.0501-0.03895-0.01462-0.06353 0.0501-0.11245 0.10561-0.12131 0.14323-0.02285 0.24711 0.12088 0.26036 0.24806 0.03042 0.29185-0.26046 0.4944-0.52298 0.51006-0.54962 0.03282-0.91865-0.51386-0.93021-1.0135-0.02258-0.97189 0.94487-1.608 1.8361-1.6015 1.6324 0.0118 2.6793 1.6404 2.6294 3.1484-0.08684 2.6266-2.7155 4.2836-5.1569 4.1485-4.0756-0.22512-6.6121-4.3182-6.3282-8.1272 0.45649-6.1298 6.6357-9.9019 12.391-9.3758 8.9743 0.81969 14.443 9.899 13.544 18.359-1.363 12.831-14.391 20.585-26.531 19.136-4.5355-0.54186-8.8987-2.2343-12.672-4.7988" stroke-width=".529"/>
            </g>
            <ellipse id={style["wind_stroke_ring"]} cx="30.445" cy="30.038" rx="25.773" ry="24.333" stroke="#01c3d5" stroke-linejoin="round" stroke-width=".66146" fill="none"/>
            </svg>
            <div className={style['leaves']} id="leave_1">
                <svg width="8.6599mm" height="2.9988mm" version="1.1" viewBox="0 0 8.6599 2.9988" xmlns="http://www.w3.org/2000/svg">
                    <path d="m7.469 2.39s-2.0235 0.4425-3.2624 0.35679c-2.8001-0.19373-4.206-1.5038-4.206-1.5038 0.93917-0.5288 2.7596-1.4486 4.2009-1.2046 1.3529 0.22907 2.2728 0.92506 3.2673 2.3516z" fill="#9afd3a" stroke-width=".71311"/>
                    <path d="m0 1.24s1.2487 0.0471 3.5771 0.22226c2.3735 0.17845 4.4535 1.499 4.7932 1.5277 0.40712 0.0344 0.36031-0.41205 0.01285-0.54589-0.94995-0.36584-3.0397-1.1254-4.7302-1.1647-2.5391-0.059-3.653-0.0395-3.653-0.0395z" fill="#9a563a" stroke-width="1.7602"/>
                </svg>
            </div>
            <div className={style['leaves']} id="leave_2">
                <svg width="9.0261mm" height="2.8702mm" version="1.1" viewBox="0 0 9.0261 2.8702" xmlns="http://www.w3.org/2000/svg">
                    <path d="m4.898 2.87c1.9702 0 4.1284-1.4011 4.1284-1.4011-1.1199-0.67509-2.6613-1.4388-4.0043-1.4674-3.6867-0.0787-5.0757 2.767-0.12418 2.8686h9e-6z" fill="#9afd3a" stroke-width=".71475"/>
                    <path d="m9.027 1.47s-3.105 0.2976-5.4334 0.12246c-2.3735-0.17845-2.9117-0.29292-3.2514-0.32162-0.40712-0.0344-0.46413 0.37987-0.09225 0.39985 0.91244 0.049 1.7204 0.0484 3.4109 0.0876 2.5391 0.059 5.3662-0.28841 5.3662-0.28841z" fill="#9a563a" stroke-width="1.7602"/>
                </svg>
            </div>
            <div className={style['leaves']} id="leave_3">
                <svg width="9.0594mm" height="3.0211mm" version="1.1" viewBox="0 0 9.0594 3.0211" xmlns="http://www.w3.org/2000/svg">
                    <path d="m0.841 1.78s2.6693 1.3323 3.9319 1.2388c2.8542-0.2114 4.287-1.6411 4.287-1.6411-0.95727-0.57706-1.6822-1.3843-3.0481-1.3752-1.3796 9e-3 -2.2172 0.86062-3.4437 1.383-0.56187 0.2393-1.7271 0.39444-1.7271 0.39444z" fill="#9afd3a" stroke-width=".61097"/>
                    <path d="m9.063 1.38s-3.1221 0.6606-5.4505 0.48546c-2.3735-0.17845-2.9283-0.32889-3.268-0.3576-0.40712-0.0344-0.46413 0.37987-0.09225 0.39985 0.91244 0.049 1.7931 0.0567 3.4836 0.0959 2.5391 0.059 5.3271-0.62371 5.3271-0.62371z" fill="#9a563a" stroke-width="1.7602"/>
                </svg>
            </div>
        </div>
    );
};

export default Windy;