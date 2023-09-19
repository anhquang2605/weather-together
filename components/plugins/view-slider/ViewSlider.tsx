import React, { useEffect } from 'react';
import style from './view-slider.module.css';
import Slide from './slide/Slide';
import { useViewSliderContext } from './useViewSliderContext';

interface ViewSliderProps {
    childSlidesContent: React.ReactNode[];
}

const ViewSlider: React.FC<ViewSliderProps> = (props) => {
    const {childSlidesContent} = props;
    const {activeSlide, setActiveSlide} = useViewSliderContext();
    return (
        <div className={style['view-slider']}>
            <div className={style["slider-container"]}>
                {childSlidesContent.map((content, index) => {
                    return(
                        <Slide index={index} key={index} active={index === activeSlide}>
                            {content}
                        </Slide>
                    )
                })}
            </div>
        </div>
    );
};

export default ViewSlider;