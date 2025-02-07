import React from 'react';
import style from './loading-box.module.css';

interface LoadingBoxProps {
    variant?: 'small' | 'medium' | 'large' | '';
    long?: boolean;
    children?: React.ReactNode;
    withChildren?: boolean;
    extraClassname?: string;
    isFluid?: boolean
}

const LoadingBox: React.FC<LoadingBoxProps> = ({variant = 'medium', children, long, withChildren = false, extraClassname = '', isFluid = false}) => {
    return (
        <span className={`${style['loading-box']} ${ isFluid && style['fluid']} ${style[variant]} ${!withChildren && style['without-children']} ${long && style['long']} ${extraClassname}`}>
            {children}
        </span>
    );
};

export default LoadingBox;