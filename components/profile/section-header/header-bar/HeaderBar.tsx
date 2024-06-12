import React from 'react';
import style from './header-bar.module.css';

interface HeaderBarProps {
    currentIndex: number;
    numberOfSections: number;
}
const BarCicle = () => {
    return (
        <div className={style['bar-cicle']}>
        </div>
    )
}
const CircleEdge = () => {
    return (
        <div className={style['circle-edge']}>
        </div>
    )
}
const HeaderBar: React.FC<HeaderBarProps> = ({currentIndex, numberOfSections}) => {
        const generateBarBackbone = (numberOfSections: number) => {
            let barBackbone = [];
            for (let i = 0; i < numberOfSections; i++) {
                barBackbone.push(
                    <>
                        <BarCicle />
                        {i !== numberOfSections - 1 && <CircleEdge />}
                    </>
                );
            }
            return barBackbone
        }
    
    return (
        <div className={style['header-bar']}>
            
        </div>
    );
};

export default HeaderBar;