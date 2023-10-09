import React from 'react';
import style from './loading-box.module.css';

interface LoadingBoxProps {
    variant?: 'small' | 'medium' | 'large';
    long?: boolean;
    children?: React.ReactNode;
    withChildren?: boolean;
}

const LoadingBox: React.FC<LoadingBoxProps> = ({variant = 'medium', children, long, withChildren = false}) => {
    return (
        <span className={`${style['loading-box']} ${style[variant]} ${!withChildren && style['without-children']} ${long && style['long']}`}>
            {children}
        </span>
    );
};

export default LoadingBox;