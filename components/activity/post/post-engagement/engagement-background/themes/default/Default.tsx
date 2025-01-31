import React from 'react';
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
const CLOUD_DELAY = 2000;
const Default: React.FC<DefaultProps> = ({}) => {
    return (
        <div className={style['default']}>
            <div className={style['svg-cloud']}>
                <SnowCloud delay={CLOUD_DELAY} />
            </div>
           <div className={style['svg-cloud']}>
                <SunCloud delay={CLOUD_DELAY}/>
            </div>
            <div className={style['svg-cloud']}>
                <RainBowCloud delay={CLOUD_DELAY}/>
            </div>
            <div className={style['svg-cloud']}>
                <ThunderCloud delay={CLOUD_DELAY} />
            </div>
            <div className={style['svg-cloud']}>
                <RainCloud delay={CLOUD_DELAY}/>
            </div>
        </div>
    );
};

export default Default;