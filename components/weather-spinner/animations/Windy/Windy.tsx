import React, { useEffect } from 'react';
import style from './windy.module.css';
import anime from 'animejs';
import { set } from 'lodash';
import { multiPathExpandBackwardAnimation, multiPathShrinkForwardAnimation, pathRevealAnimation, pathShrinkAnimation, propertiesStagesAnimation, unFollowPathAnimation } from '../../../../libs/anime-animations-helpers';
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
        const windPathSameDirectionShrunkAnimations: any[] = multiPathShrinkForwardAnimation(`.${style['windy_path']} path`, 'linear', WIND_PATH_DURATION * 1.3);
        windPathSameDirectionShrunkAnimations.forEach(
            (anim:any, index: number) => {
                timeline.add(anim, WIND_PATH_DURATION / 2);
            }
        )
        //small wind path animation expansion
        const SMALL_WIND_PATH_DURATION = WIND_PATH_DURATION / 1.5;
        const SMALL_WIND_PATH_OFFSET = WIND_PATH_DURATION / 2.5;
        const smallWindPathExpandingAnimation: any = pathRevealAnimation(`#${style['small-wind-path']} path`, 'easeInExpo', SMALL_WIND_PATH_DURATION, false);
        timeline.add(smallWindPathExpandingAnimation, '-= ' + SMALL_WIND_PATH_OFFSET);

       const smallWindPathSameDirectionShrunkAnimations: any[] = multiPathShrinkForwardAnimation(`#${style['small-wind-path']} path`, 'linear', SMALL_WIND_PATH_DURATION);
        smallWindPathSameDirectionShrunkAnimations.forEach(
            (anim:any, index: number) => {
                timeline.add(anim, '-= ' + SMALL_WIND_PATH_DURATION);
            }
        )

        //wind path animation shrunken
        const windPathExpandingBackwardAnimations: any[] = multiPathExpandBackwardAnimation(`.${style['windy_path']} path`, 'linear', WIND_PATH_DURATION);
        windPathExpandingBackwardAnimations.forEach(
            (anim:any, index: number) => {
                timeline.add(anim, '-= ' + (WIND_PATH_DURATION * index));
            }
        )

        const windPathShrinkingAnimation: any = pathShrinkAnimation(`.${style['windy_path']} path`, 'easeInExpo', WIND_PATH_DURATION, false);
        //timeline.add(windPathShrinkingAnimation);

        //leaves animation
        const leavesAnimations: any = [];
        const leavesBackwardAnimations: any = [];
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
                           changeBegin: () => {
                            const leaf = document.querySelector(`#leave_${index + 1} svg`);
                            if (leaf) {
                                leaf.classList.remove(style['leave_floating']);
                                leaf.classList.add(style['blur']);
                            }
                           },
                           changeComplete: () => {
                            const leaf = document.querySelector(`#leave_${index + 1} svg`);
                            if (leaf) {
                                leaf.classList.add(style['leave_floating']);
                                leaf.classList.remove(style['blur']);
                            }
                           }
                        } 
                        ,false));
                leavesBackwardAnimations.push(propertiesStagesAnimation(`#leave_${index + 1}`, 'easeInExpo', LEAVES_DURATION,
                    {
                        translateX: paths[index]('x'),
                        translateY: paths[index]('y'),
                        rotate: paths[index]('angle'),
                        scale: [1.2, 0],
                        direction: 'reverse',
                        changeBegin: () => {
                            const leaf = document.querySelector(`#leave_${index + 1} svg`);
                            if (leaf) {
                                leaf.classList.remove(style['leave_floating']);
                                leaf.classList.add(style['blur']);
                            }
                           },
                    }
                ), false);
                

                for (let i = 0; i < leavesAnimations.length; i++) {
                    timeline.add(leavesAnimations[i], LEAVES_DELAY * i);
                }

                })
            
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
            <g id={style['small-wind-path']} stroke="#00eab5" fill="none">
                <path id={style['small-wind-path-1']} transform="scale(.26458)" d="m115.16 117.96c-0.0363 0.0212-0.0689-0.0398-0.074-0.0651-0.0346-0.16972 0.18271-0.26348 0.31621-0.26256 0.47011 3e-3 0.6761 0.56311 0.62095 0.95524-0.14248 1.0131-1.3343 1.4022-2.2122 1.1976-1.8821-0.43861-2.5455-2.6678-2.042-4.342 0.95233-3.1668 4.7496-4.2169 7.6204-3.2052 4.9623 1.7489 6.5335 7.7786 4.7395 12.341-2.8975 7.3682-11.965 9.6178-18.812 6.6991-10.489-4.4708-13.598-17.529-9.1394-27.359 6.5449-14.432 24.7-18.605 38.318-12.117 19.308 9.1986 24.778 33.715 15.692 52.037-0.93445 1.8844-2.0046 3.7011-3.1966 5.434"/>
                <path id={style['small-wind-path-2']} transform="scale(.26458)" d="m115.16 117.96c-3e-3 9e-3 -0.025-8e-3 -0.0259-9e-3 -0.0839-0.0843 0.0529-0.21725 0.12025-0.2512 0.41472-0.20918 0.81521 0.27542 0.91102 0.62455 0.32543 1.1859-0.92292 2.1111-1.954 2.2564-2.6102 0.36782-4.4355-2.289-4.5604-4.6149-0.26431-4.9212 4.7027-8.15 9.1692-8.1155 8.3706 0.0647 13.643 8.5219 13.232 16.226-0.70542 13.225-14.129 21.325-26.432 20.235-19.765-1.7502-31.627-21.93-29.466-40.473 3.2965-28.284 32.349-45.001 59.063-41.278 39.085 5.4464 61.911 45.828 56.036 82.948-8.3065 52.483-62.826 82.843-112.9 74.119"/>
                <path id={style['small-wind-path-3']} transform="scale(.26458)" d="m115.15 117.96c-1e-3 -6e-3 0.0186-4e-3 0.0195-4e-3 0.0829 0.0215 0.0469 0.15402 0.0176 0.19976-0.18023 0.28173-0.60613 0.12838-0.79356-0.0528-0.63665-0.61543-0.20254-1.6466 0.38304-2.1148 1.4824-1.1854 3.5878-0.2087 4.5184 1.1866 1.9689 2.9522 0.0757 6.7748-2.7044 8.3918-5.2101 3.0304-11.579-0.2758-14.15-5.1997-4.4141-8.4531 0.93243-18.396 8.9548-22.234 12.889-6.1658 27.641 1.9867 33.103 14.268 8.3324 18.734-3.5366 39.748-21.454 47.241-26.215 10.963-55.17-5.6848-65.146-30.84-14.105-35.565 8.5392-74.375 42.765-87.337" stroke-linecap="round" stroke-width="1.0016"/>
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