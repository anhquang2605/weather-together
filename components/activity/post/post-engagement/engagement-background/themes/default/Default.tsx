import React, { useEffect } from 'react';
import style from './default.module.css';
import SVGWrapper from '../../../svg-wrapper/SVGWrapper';
import SnowCloud from '../../animation-components/default-bg-theme/snow-cloud/SnowCloud';
import SunCloud from '../../animation-components/default-bg-theme/sun-cloud/SunCloud';
import RainBowCloud from '../../animation-components/default-bg-theme/rb-cloud/RainBowCloud';
import ThunderCloud from '../../animation-components/default-bg-theme/thunder-cloud/ThunderCloud';
import RainCloud from '../../animation-components/default-bg-theme/rain-cloud/RainCloud';

interface DefaultProps {

}

/* const SVGWrapperGenerator = (fileNames: string[]) => {
    const backbones = [];
    const SHARED_CLASS = style['svg-cloud'];
    for (const fileName of fileNames) {
        const theSVG = <SVGWrapper className={SHARED_CLASS} key={fileName} fileName={fileName} />
        backbones.push(theSVG);
    }

    return backbones;
} */
const CloudComponents = [
    <SnowCloud />,
    <SunCloud />,
    <RainBowCloud />,
    <ThunderCloud />,
    <RainCloud />
]
const SVG_CLOUD_GENERATOR = (CloudComponents: JSX.Element[]) => {
    const backbones = [];
    for (let i = 0; i < CloudComponents.length; i++) {
        const theSVG = CloudComponents[i];
        backbones.push(<div className={style['svg-cloud'] + " " + style['svg-cloud-' + i]} key={i}>{theSVG}</div>);
    }
    return backbones;
}
const randomizedOrders = (maxRange: number) => {
    const numbers = [];
    for (let i = maxRange - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        numbers[j] = i;
        numbers[i] = j;
    }
    return numbers;
}
//Determine the position to add to an array, this way each position will be unique, and the order will be randomized
function generateAndShuffleRange(start: number, end: number) {
    let arr: number[] = [];
    for (let i = start; i <= end; i++) {
        // Generate a random index to insert the current number
        //get j between 0 and arr.length and 1, this is math floor so gotta add 1 to the max range to include end. as the array grow, the max range will increase as well.
        const j = Math.floor(Math.random() * (arr.length + 1));
        // Insert the number at the random position
        //start position j, remove 0 element, add i to this position
        arr.splice(j, 0, i);
    }
    return arr;
}
const CLOUD_DELAY = 2000;
const Default: React.FC<DefaultProps> = ({}) => {
    useEffect(() => {
        //const orders = randomizedOrders(CloudComponents.length);
        const orders = generateAndShuffleRange(0, CloudComponents.length - 1);
        console.log(orders);
    },[])
    
    return (
        <div className={style['default']}>
            <div className={style['svg-cloud']}>
                <SnowCloud />
            </div>
           <div className={style['svg-cloud']}>
                <SunCloud />
            </div>
            <div className={style['svg-cloud']}>
                <RainBowCloud />
            </div>
            <div className={style['svg-cloud']}>
                <ThunderCloud />
            </div>
            <div className={style['svg-cloud']}>
                <RainCloud />
            </div>
        </div>
    );
};

export default Default;