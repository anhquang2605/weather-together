import React from 'react';
import style from './default.module.css';
import SVGWrapper from '../../../svg-wrapper/SVGWrapper';

interface DefaultProps {

}
const SVGFILES = [
    'snow-cloud',
    'rain-cloud',
    'sun-cloud',
    'thunder-cloud',
    'rb-cloud',
]
const SVGWrapperGenerator = (fileNames: string[]) => {
    const backbones = [];
    for (const fileName of fileNames) {
        const theSVG = <SVGWrapper fileName={fileName} />
        backbones.push(theSVG);
    }

    return backbones;
}

const Default: React.FC<DefaultProps> = ({}) => {
    return (
        <div className={style['default']}>
            {
                SVGWrapperGenerator(SVGFILES)
            }   
        </div>
    );
};

export default Default;