import React from 'react';
import style from './lazy-target.module.css';
import LoadingIndicator from '../loading-indicator/LoadingIndicator';

interface LazyTargetProps {
    fetchingStatus: string;
    targetClassName: string;//for observing with intersection observer
}

const LazyTarget: React.FC<LazyTargetProps> = ({fetchingStatus, targetClassName}) => {

    return (
        <div className={`${style['lazy-target']} ${targetClassName} ${fetchingStatus !== 'idle' && style['with-status']}`}>
            {
                fetchingStatus === 'loading'
                 && <LoadingIndicator/>
            }
            {
                fetchingStatus === 'error'
                 && <p className="w-full h-full flex items-center justify-center text-red-400 border border-red-400 rounded">Error</p>
            }
        </div>
    );
};

export default LazyTarget;