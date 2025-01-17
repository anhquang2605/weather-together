import React from 'react';
import style from './svg-wrapper.module.css';

interface SVGWrapperProps {
    fileName: string;
    className?: string;
}

const SVGWrapper: React.FC<SVGWrapperProps> = (props) => {
    const {
        fileName,
        className = ''
    } = props;
    //assets/svg/post-engagement/engagement-background/default/${fileName}.svg
    const SvgComponent = require(`./../../../../../assets/svg/post-engagement/engagement-background/default/${fileName}.svg`).default;
    return (
        <div className={`${style['svg-wrapper']} ${className}`}>
            <SvgComponent />
        </div>
    );
};

export default SVGWrapper;