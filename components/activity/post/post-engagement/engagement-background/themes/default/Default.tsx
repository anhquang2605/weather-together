import React from 'react';
import style from './default.module.css';

interface DefaultProps {

}

const Default: React.FC<DefaultProps> = ({}) => {
    return (
        <div className={style['default']}>
            Default
        </div>
    );
};

export default Default;