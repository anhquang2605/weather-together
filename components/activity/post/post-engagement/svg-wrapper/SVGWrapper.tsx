import React from 'react';
import style from './.module.css';

interface SVGWrapperProps {
    svgFileName: string;
}

const SVGWrapper: React.FC<SVGWrapperProps> = (props) => {
    const {
        svgFileName
    } = props;
    const SvgComponent = require(`./../../../../assets/svg/post-engagement/${svgFileName}.svg`).default;
    return (
        <div className={style['svg-wrapper']}>
            <SvgComponent />
        </div>
    );
};

export default SVGWrapper;