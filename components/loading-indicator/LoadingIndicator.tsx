import React from 'react';
import style from './.module.css';
import LoadingIcon from '../plugins/loading-icon/LoadingIcon';

interface LoadingIndicatorProps {
    fluid?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({fluid}) => {
    return (
        <div className={'animate-pulse w-full h-full flex flex-row justify-center rounded-lg items-center bg-slate-400/30' + (fluid ? '' : ' min-h-[200px]')}>
            <LoadingIcon />
        </div>
    );
};

export default LoadingIndicator;