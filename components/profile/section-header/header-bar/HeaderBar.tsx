import React from 'react';
import style from './header-bar.module.css';
import HeaderTitle from '../header-titles-group/header-title/HeaderTitle';
import MiniSun from './mini-sun/MiniSun';
import HeaderIcon from './header-icon/HeaderIcon';

interface HeaderBarProps {
    currentIndex: number;
    titles: string[];
}
interface BarCicleProps {
    children?: React.ReactNode
}
const BarCicle: React.FC<BarCicleProps> = ({children}: BarCicleProps) => {
    return (
        <div className={style['bar-circle']}>
            {children}
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
                    <React.Fragment key={i}>
                    
                    <div key={titles[i]} className={style['bar-circle-group']}>

                        <BarCicle>
                            <HeaderIcon isCurrent={currentIndex === i} title={titles[i]} />
                            <MiniSun isCurrent={currentIndex === i}/>
                        </BarCicle>
                        <HeaderTitle isCurrentIndex={currentIndex === i} title={titles[i]} />
                    </div>
                    {i !== numberOfSections - 1 && <CircleEdge />}
                    </React.Fragment>
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