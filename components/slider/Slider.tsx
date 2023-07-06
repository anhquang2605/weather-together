import React from 'react';
import ReactSlider from 'react-slider';
import styles from './slider.module.css';
import {IoAdd, IoRemove} from 'react-icons/io5';
interface SliderProps {
    min: number;
    max: number;
    defaultValue: number;
    onSliderChange: (value: number) => void;
    step: number;
    value: number;
    //for tailwind and custom styles
    thumbClassName?: string | "";
    trackClassName?: string | "";
    sliderClassName?: string | "";
    thumbActiveClassName?: string | "";
}

const Slider = ({ min, max, defaultValue, onSliderChange, step, value, sliderClassName, thumbClassName, trackClassName, thumbActiveClassName}: SliderProps) => {
    return (
      <div className={styles["slider-wrapper"]}>
        <IoRemove className="w-8 h-8 pt-0.5"/>
        <ReactSlider
          min={min}
          max={max}
          step={step}
          defaultValue={defaultValue}
          value = {value}
          onChange={onSliderChange}
          thumbActiveClassName={styles["thumb-active"] + " " + thumbActiveClassName}
          className={styles["horizontal-slider"] + " " + sliderClassName}
          thumbClassName={styles["slider-thumb"] + " " + thumbClassName}
          trackClassName={styles["slider-track"]  + " " + trackClassName}
        />
        <IoAdd className="w-8 h-8"/>
      </div>    

  );
};

export default Slider;