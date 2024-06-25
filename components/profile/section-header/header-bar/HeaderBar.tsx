import React from 'react';
import style from './header-bar.module.css';
import HeaderTitle from '../header-titles-group/header-title/HeaderTitle';

interface HeaderBarProps {
    currentIndex: number;
    titles: string[];
}
const BarCicle = () => {
    return (
        <div className={style['bar-circle']}>
        </div>
    )
}
const CircleEdge = () => {
    return (
        <div className={style['circle-edge']}>
        </div>
    )
}
const HeaderBar: React.FC<HeaderBarProps> = ({currentIndex, titles}) => {
        const generateBarBackbone = (numberOfSections: number) => {
            let barBackbone = [];
            for (let i = 0; i < numberOfSections; i++) {
                barBackbone.push(
                    <>
                    
                    <div key={i} className={style['bar-circle-group']}>

                        <BarCicle />
                        <HeaderTitle isCurrentIndex={currentIndex === i} title={titles[i]} />
                    </div>
                    {i !== numberOfSections - 1 && <CircleEdge />}
                    </>
                );
            }
            return barBackbone
        }
    
    return (
        <div className={style['header-bar']}>
            {generateBarBackbone(titles.length)}
        </div>
    );
};

export default HeaderBar;