import React, { useEffect, useRef, useState } from 'react';
import style from './fav-weather-wheel.module.css';
import WeatherIcon from '../../weather-widgets/pluggins/weather-icon/WeatherIcon';
import {WEATHERS} from '../../../constants/weathers';
import { dir, time } from 'console';
import { current } from '@reduxjs/toolkit';
import { add } from 'lodash';
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
    const endingAngleRef = useRef<number>(0);
    const directionRef = useRef<number>(1); //-1 or 1
    const weatherOptionRef = useRef<HTMLElement|null>(null);//options collection
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
        const elapsedTime = Math.round(timestamp - startTime);
        const addedAngle = elapsedTime * speed;
        const len = optionsElements.length;
        // Calculate the current angle based on the elapsed time
/*         let currentAngle = Math.round(Math.min(addedAngle + currentAngleRef.current , totalDegrees)); */
        let currentAngle = Math.round(addedAngle + currentAngleRef.current);
        let optionsDistributed  = Math.round(addedAngle / optionAngleRef.current);
    
        /*   if (currentAngle >= totalDegrees) {
            return; // Stop the animation when the target degrees are reached
        } */
        console.log(optionsDistributed, len);
       if(optionsDistributed > len ){
           endingAngleRef.current = currentAngle;
           return;
       } 
            let start = 0;
            let endSignal = len;
        /* if(directionRef.current === -1){
            start = len - 1;
            endSignal = 0;
        } */
        while(start !== endSignal){
            if(start < optionsDistributed - 1){
                start += 1;
                continue;   
            }

            /* if( start < optionsDistributed - 1){
                start += 1;
                continue;
            } */    

            const object = optionsElements[start];
            const x = Math.round(rX + (radius * Math.cos(currentAngle * (Math.PI / 180)))) - optionW;
            const y = Math.round(rY + (radius * Math.sin(currentAngle * (Math.PI / 180)))) - optionH;
            object.style.left = `${x}px`; // Offset to center the object
            object.style.top = `${y}px`;
            
            start += 1;
        }
    
        
       /*  //Animation must be applied for each object, we should path animatin
        for (let i = 0; i < len; i++) {
            if(i < optionsDistributed - 1){
                continue;
            }
            const object = optionsElements[i];
            const x = Math.round(rX + (radius * Math.cos(currentAngle * (Math.PI / 180)))) - optionW;
            const y = Math.round(rY + (radius * Math.sin(currentAngle * (Math.PI / 180)))) - optionH;
            object.style.left = `${x}px`; // Offset to center the object
            object.style.top = `${y}px`;
        } */
        // Calculate the position based on the current angle
        // Increase the angle for the next frame
        // Continue the animation
        requestRef.current = requestAnimationFrame(moveObject);
    }
    function reverseMoveObject(timestamp: number) {
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
        const elapsedTime = Math.round(timestamp - startTime);
        const addedAngle = elapsedTime * speed;
        const len = optionsElements.length;
        // Calculate the current angle based on the elapsed time
/*         let currentAngle = Math.round(Math.min(addedAngle + currentAngleRef.current , totalDegrees)); */
        let currentAngle = Math.round(addedAngle + currentAngleRef.current);

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
    /**
     * Calculates the angle of a point relative to the center of the container
     * @param x the x coordinate of the point
     * @param y the y coordinate of the point
     * @returns the angle in degrees
     */
    const getAngle = (x: number, y: number): number => {
        const dx = x - containerCenterRef.current[0];
        const dy = y - containerCenterRef.current[1];
        const rad = Math.atan2(dy, dx);
        return rad * (180 / Math.PI);
    }
    /**
     * Calculates the angle of a triangle given the length of the sides of the
     * isosceles triangle and the base of the triangle.
     * @param a the length of the sides of the isosceles triangle
     * @param b the length of the base of the triangle
     * @returns the angle of the triangle in degrees
     */
    const getAngleOption = (a: number, b: number): number => {
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
    const initiatingAnimation = () => {
        //set up for the animation
        const angle = Math.ceil(getAngle(currentRotatePosition.current[0], currentRotatePosition.current[1]));
        const optionSize = getOptionSize();
        const centerSize = getContainerCenter(style['fav-weather-wheel']);
        currentAngleRef.current = angle + 10;
        timeRef.current = 0;
        optionSizeRef.current = optionSize;
        optionAngleRef.current = getAngleOption(centerSize[0], optionSize[0]);
        containerCenterRef.current = centerSize;
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
        initiatingAnimation();
        //get reference to the options
        const weatherOptionsElement = weatherOptionRef.current = document.getElementsByClassName(style['weather-options'])[0] as HTMLElement;
        weatherOptionRef.current = weatherOptionsElement;        
        if(isExpanded){
            weatherOptionsElement.style.visibility = 'visible';
            requestRef.current = requestAnimationFrame(moveObject);
            
        }else {
            weatherOptionsElement.style.visibility = 'hidden';
        }
        return () => {
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
                    <div className={`${style['featured-weather']} ${
                        isExpanded ? style['expanded-featured'] : ''
                    }`}>
                    {
                        isExpanded &&
                        <span className={style['choose-weather-title']}>
                            Fav weather?
                        </span>
                    }
                    <WeatherIcon
                        weatherName={weatherName || ''}
                        size={ shortDimension(size)}
                    />
                    </div>

                    <div className={`${style['weather-options']} ${isExpanded ? style['expanded-options'] : ''} `}>
                        {
                            WEATHERS.map((weather) => {
                                if (weather.name === weatherName) {
                                    return null;
                                } else {
                                    return (
                                        <div
                                            className={style['weather-option']}
                                            key={weather.name}
                                        >
                                            <WeatherIcon
                                                weatherName={weather.name}
                                                size={shortDimension('large')}
                                            />
                                        </div>
                                    );
                                }
                            })
                        }
                    </div>
        </div>
    );
};

export default FavWeatherWheel;