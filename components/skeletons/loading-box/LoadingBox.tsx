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
        <div className={`${style['loading-box']} ${style[variant]} ${!withChildren && style['without-children']} ${long && style['long']}`}>
            {children}
        </div>
    );
};

export default LoadingBox;