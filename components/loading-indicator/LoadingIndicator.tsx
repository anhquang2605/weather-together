import React from 'react';
import style from './.module.css';

interface LoadingIndicatorProps {

}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({}) => {
    return (
        <div className='animate-pulse w-full h-full flex flex-row justify-center rounded-lg items-center bg-slate-400/30'>
            <span>...Loading</span>
        </div>
    );
};

export default LoadingIndicator;