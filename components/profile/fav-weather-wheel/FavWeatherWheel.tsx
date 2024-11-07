import React, { useEffect, useRef, useState } from 'react';
import style from './fav-weather-wheel.module.css';
import WeatherIcon from '../../weather-widgets/pluggins/weather-icon/WeatherIcon';
import {WEATHERS} from '../../../constants/weathers';
import { time } from 'console';
import { current } from '@reduxjs/toolkit';
interface FavWeatherWheelProps {
    weatherName: string;
    isEditable?: boolean;
    size: string;
}
/**
 * This component is used to display the favorites weathers options when they want to edit their favorite weathers
 */
const FavWeatherWheel: React.FC<FavWeatherWheelProps> = ({size, weatherName, isEditable}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const optionsRef = useRef<HTMLCollectionOf<HTMLElement> | null>(null); //
    const requestRef = useRef<number>(0);
    const timeRef = useRef<number>(0);
    const containerCenterRef = useRef<number[]>([0,0]);
    const currentRotatePosition = useRef<number[]>([0,0]);
    const currentAngleRef = useRef<number>(0);
    const optionSizeRef = useRef<number[]>([0,0]);//option width and height
    const optionAngleRef = useRef<number>(0);//angle for each option to make sure that they are not overlapping on the circular path
    //refer to options object
    const handleToggle = () => {
        setIsExpanded(prev => !prev);
    }

    const shortDimension = (size:string) => {
        switch(size){
            case 'two-x-large':
                return 'xl';
            case 'extra-large':
                return 'lg';
            case 'large':
                return 'md';
            case 'medium':
                return 'sm';
            case 'small':
                return 'sm';
            default:
                return 'md';
        }
    }
    
    const speed = 0.5; // Degrees to move per frame

    const totalDegrees = 270; // Total degrees of rotation (e.g., 720° = 2 full rotations)
    function getOptionsElement() {
        const optionsElements = document.getElementsByClassName(style['weather-option']);
        return optionsElements as HTMLCollectionOf<HTMLElement>;
    }
    function moveObject(timestamp: number) {
        const radius = containerCenterRef.current[0];
        const rX = containerCenterRef.current[0];
        const rY = containerCenterRef.current[1];
        const optionW = optionSizeRef.current[0] / 2;
        const optionH = optionSizeRef.current[1] / 2;
        if(!optionsRef.current){
            return;
        }
        const optionsElements: HTMLCollectionOf<HTMLElement> = optionsRef.current;
        let startTime = timeRef.current;
        if (timeRef.current === 0) {
            timeRef.current = timestamp;
            startTime = timestamp;
        }
        // Calculate the elapsed time
        const elapsedTime = timestamp - startTime;
        const addedAngle = elapsedTime * speed;
        // Calculate the current angle based on the elapsed time
        let currentAngle = Math.round(Math.min(addedAngle + currentAngleRef.current , totalDegrees));
        const optionsDistributed = Math.floor(addedAngle / optionAngleRef.current) 
        if (currentAngle >= totalDegrees) {
            return; // Stop the animation when the target degrees are reached
        }
        //Animation must be applied for each object, we should path animatin
        for (let i = 0; i < optionsElements.length; i++) {
            if(i <= optionsDistributed){
                continue;
            }
            const object = optionsElements[i];
            const x = (rX + (radius * Math.cos(currentAngle * (Math.PI / 180)))) - optionW;
            const y = (rY + (radius * Math.sin(currentAngle * (Math.PI / 180)))) - optionH;
            object.style.left = `${x}px`; // Offset to center the object
            object.style.top = `${y}px`;
        }
        // Calculate the position based on the current angle
        // Increase the angle for the next frame
        // Continue the animation
        requestRef.current = requestAnimationFrame(moveObject);
    }
    const getContainerCenter = (containerClassname: string) => {
        const container = document.getElementsByClassName(containerClassname)[0];
        if(container){
            //get width and height of the container
            const {width, height} = container.getBoundingClientRect();
            return [width/2, height/2];
        } 
        return [0,0];
    }
    const getCurrentRotatePosition = () => {
        const featuredWeather = document.getElementsByClassName(style['featured-weather'])[0];
        if(!featuredWeather){
            return [0,0];
        }
        const {left, top} = featuredWeather.getBoundingClientRect();
        return [left, top];
    }
    const getAngle = (x: number, y: number) => {
        const dx = x - containerCenterRef.current[0];
        const dy = y - containerCenterRef.current[1];
        const rad = Math.atan2(dy, dx);
        return rad * (180 / Math.PI);
    }
    const getAngleOption = (length: number) => {
        const a = containerCenterRef.current[0]; //sides of isosceles triangle
        const b = optionSizeRef.current[0]; //base of isosceles triangle
        const angle = Math.acos(
            (2 * Math.pow(a, 2) - Math.pow(b, 2)) / (2 * Math.pow(a, 2))
        )
        return angle * (180 / Math.PI);
    }
    const getOptionSize = () => {
        const optionsElements = document.getElementsByClassName(style['weather-option'])[0];
        if(optionsElements){
            const {width, height} = optionsElements.getBoundingClientRect();
            return [width, height];
        }
        return [0,0];
    }
    useEffect(()=>{
        currentRotatePosition.current = getCurrentRotatePosition();
        if(optionsRef){
            optionsRef.current = getOptionsElement();
        }
        if(timeRef){
            timeRef.current = 0;
        }
    },[])
    //What next?
    /* Calculate the stagger for each element using the number of element and their dimension
    - each element will fill up the angle, the last element will be at the end of the angle, while the start element will be at the start of the angle
    _ Approaches:
        1. Calculate the angle per element, we must distribute element along the cicular path making sure that each element wont overlap each other
        2. Record the cummulative angle, when get to a certain angle, stop the animation on a certain element
    */
    useEffect(() => {
        if(isExpanded){
            const angle = getAngle(currentRotatePosition.current[0], currentRotatePosition.current[1]);
            currentAngleRef.current = angle;
            timeRef.current = 0;
            optionSizeRef.current = getOptionSize();
            optionAngleRef.current = getAngleOption(optionSizeRef.current[0]);
            requestRef.current = requestAnimationFrame(moveObject);
            containerCenterRef.current = getContainerCenter(style['fav-weather-wheel']);
            return () => {
                cancelAnimationFrame(requestRef.current);
            }
            
        }else {
            cancelAnimationFrame(requestRef.current);
        }
    },[isExpanded])
    /**
     * How to move element along a circular path?
     * 1. Use Anime.js path animation
     *    - https://animejs.com/documentation
     *    - Need to create semi circular path using inkScape
     *    - Depdency: animejs
     * 2. Use CSS animation?
     *    - 
     * 3. Use JS animation?
     *    - Take advantage of the requestiontAnimationFrame for smooth animation
     *    - Use sine and cosine function to calculate x and y position of object perframe according to the angle
     *    - angle is used to control speed
     *    - radius can be changed
     */
        
    return (
        <div className={style['fav-weather-wheel']} onClick={handleToggle}>
            {
                !isExpanded ? (
                    <div className={style['featured-weather']}>
                    <WeatherIcon
                        weatherName={weatherName || ''}
                        size={ shortDimension(size)}
                    />
                    </div>
                ) : (
                    <div className={style['weather-options']}>
                {WEATHERS.map((weather) => (
                    <div
                        className={style['weather-option']}
                        key={weather.name}
                    >
                        <WeatherIcon
                            weatherName={weather.name}
                            size={shortDimension(size)}
                        />
                    </div>
                ))}
            </div>
                )
            }
            
            
        </div>
    );
};

export default FavWeatherWheel;