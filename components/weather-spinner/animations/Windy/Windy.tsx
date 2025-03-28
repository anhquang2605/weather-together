import React, { useEffect } from 'react';
import style from './windy.module.css';
import anime from 'animejs';
import { set } from 'lodash';
import { pathRevealAnimation, pathShrinkAnimation, propertiesStagesAnimation } from '../../../../libs/anime-animations-helpers';
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

        //wind path animation shrunken
        const windPathShrinkingAnimation: any = pathShrinkAnimation(`.${style['windy_path']} path`, 'easeInExpo', WIND_PATH_DURATION, false);
        timeline.add(windPathShrinkingAnimation);

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
            <svg  width="55mm" height="55mm" version="1.1" viewBox="0 0 55 55" xmlns="http://www.w3.org/2000/svg">
            <g className={style['windy_path']} fill="none" stroke="#00eab5" stroke-linecap="round" stroke-width=".52917">
            <path id={style['wind_path_1']} d="m27.952 29.188c5e-6 4.6e-5 -1.44e-4 1.2e-5 -1.5e-4 1e-5 -9.31e-4 -2.62e-4 -2.92e-4 -0.0016 0-0.0019 0.0023-0.0032 7e-3 -8.38e-4 9e-3 0.0013 0.0077 0.0083 9.31e-4 0.02114-0.0069 0.02653-0.02165 0.01514-0.04987-0.0013-0.06127-0.02126-0.02632-0.04605 0.0076-0.1006 0.05027-0.12138 0.08604-0.04188 0.18202 0.02051 0.21629 0.10081 0.06261 0.14673-0.04318 0.30397-0.18097 0.35662-0.2339 0.08935-0.47746-0.07896-0.5542-0.29985-0.12292-0.35384 0.13184-0.71459 0.46758-0.82198 0.5134-0.16423 1.0284 0.20603 1.174 0.69521 0.21418 0.72005-0.30624 1.4333-0.99482 1.6253-0.98174 0.27371-1.9443-0.43748-2.192-1.3792-0.3438-1.3068 0.60525-2.5775 1.8623-2.8913 1.7044-0.42548 3.3502 0.81519 3.7413 2.4587 0.51974 2.1839-1.0736 4.2801-3.1839 4.761-2.7551 0.62769-5.3864-1.3868-5.9704-4.0541-0.75041-3.4285 1.7616-6.6891 5.087-7.3904 4.215-0.88901 8.2087 2.2054 9.0432 6.2998 1.0447 5.1257-2.7251 9.9668-7.7113 10.951-6.173 1.2187-11.986-3.3291-13.138-9.3412-1.4121-7.368 4.0251-14.289 11.21-15.628 6.3267-1.1793 12.771 1.9459 16.142 7.3499"/>
            <path id={style['wind_path_2']} d="m27.952 29.188c-6.5e-5 -3.2e-5 4.6e-5 -1.97e-4 6e-5 -2.13e-4 9.33e-4 -9.77e-4 0.0028 4.66e-4 0.0033 0.0011 0.0051 0.0065-0.0033 0.01549-0.0084 0.01834-0.02906 0.01637-0.06062-0.01584-0.07067-0.04013-0.03911-0.09459 0.05798-0.18357 0.13923-0.20878 0.25065-0.07771 0.46528 0.16979 0.51657 0.38944 0.13429 0.57492-0.42229 1.0364-0.93403 1.1259-1.1853 0.20714-2.0936-0.92939-2.2305-1.9977-0.28837-2.2508 1.8614-3.917 3.9108-4.102 4.0036-0.36132 6.8903 3.4604 7.1068 7.1371 0.39754 6.7528-6.0562 11.521-12.303 11.724-10.898 0.35366-18.466-10.085-18.567-20.228-0.071096-7.1809 3.1186-14.09 8.1747-19.112"/>
            <path id={style['wind_path_3']} d="m105.63 110.32c-5e-3 7e-3 -0.0201-0.0156-0.0207-0.0167-0.05-0.10312 0.11632-0.18133 0.18829-0.19117 0.44341-0.0606 0.6564 0.50644 0.63426 0.85456-0.0752 1.1825-1.5026 1.6341-2.4875 1.4433-2.4934-0.48302-3.3236-3.4757-2.7084-5.6339 1.3017-4.5665 6.839-5.9513 10.898-4.5199 7.606 2.6825 9.7587 12.04 6.9697 18.93-4.7878 11.828-19.557 15-30.424 10.151-17.459-7.7896-21.941-29.893-14.161-46.109 11.868-24.736 43.577-30.86 66.749-19.095 33.902 17.213 42.042 61.157 25.055 93.136-24.018 45.212-83.205 55.785-126.09 32.142"/>
            </g>
            <ellipse id={style["wind_stroke_ring"]} cx="27.616" cy="27.5" rx="25.773" ry="24.333" fill="none" stroke="#01c3d5" stroke-linecap="round" stroke-linejoin="round" stroke-width=".66146"/>
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