import React from 'react';
import style from './theme-placer.module.css';
import Default from '../themes/default/Default';

interface ThemePlacerProps {
    themeOption: string
}
interface Theme{
    [key: string]: JSX.Element
}
const THEMES: Theme  = {
    'default': <Default />
}

const ThemePlacer: React.FC<ThemePlacerProps> = (props) => {
    const {
        themeOption
    } = props;
    return (
        <div className={style['theme-placer']}>
            {
                THEMES[themeOption]
            }
        </div>
    );
};

export default ThemePlacer;