import React from 'react';
import style from './.module.css';

interface SVGWrapperProps {
    fileName: string;
}

const SVGWrapper: React.FC<SVGWrapperProps> = (props) => {
    const {
        fileName
    } = props;
    const SvgComponent = require(`./../../../../assets/svg/post-engagement/${fileName}.svg`).default;
    return (
        <div className={style['svg-wrapper']}>
            <SvgComponent />
        </div>
    );
};

export default SVGWrapper;