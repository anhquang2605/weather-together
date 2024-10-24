import React, { useEffect, useRef, useState } from 'react';
import style from './fav-weather-wheel.module.css';
import WeatherIcon from '../../weather-widgets/pluggins/weather-icon/WeatherIcon';
import {WEATHERS} from '../../../constants/weathers';
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
    const timeRef = useRef<number | null>(null);
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
    
    const radius = 80; // Radius of the circle
    let currentAngle = 0; // Starting angle in degrees
    const speed = 1; // Degrees to move per frame

    const totalDegrees = 30; // Total degrees of rotation (e.g., 720° = 2 full rotations)
    function getOptionsElement() {
        const optionsElements = document.getElementsByClassName(style['weather-option']);
        return optionsElements as HTMLCollectionOf<HTMLElement>;
    }
    function moveObject(timestamp: number) {
        if(!optionsRef.current){
            return;
        }
        const optionsElements: HTMLCollectionOf<HTMLElement> = optionsRef.current;
        let startTime = timeRef.current;
        // Initialize startTime if it's null
        if (startTime === 0 || startTime === null) {
            startTime = timestamp;
        }

        // Calculate the elapsed time
        const elapsedTime = timestamp - startTime;

        // Calculate the current angle based on the elapsed time
        let currentAngle = Math.min(elapsedTime * speed, totalDegrees);
        if (currentAngle >= totalDegrees) {
            return; // Stop the animation when the target degrees are reached
        }
        //Animation must be applied for each object, we should path animatin
        for (let i = 0; i < optionsElements.length; i++) {
            const object = optionsElements[i];
            const x = radius * Math.cos(currentAngle * (Math.PI / 180));
            const y = radius * Math.sin(currentAngle * (Math.PI / 180));
            object.style.left = `${x + 90}px`; // Offset to center the object
            object.style.top = `${y + 90}px`;
        }
        // Calculate the position based on the current angle
        // Increase the angle for the next frame
        // Continue the animation
        requestRef.current = requestAnimationFrame(moveObject);
    }
    useEffect(()=>{
        if(optionsRef){
            optionsRef.current = getOptionsElement();
        }
        if(timeRef){
            timeRef.current = 0;
        }
    },[])
    useEffect(() => {
        if(isExpanded){
            requestRef.current = requestAnimationFrame(moveObject);
            return () => {
                cancelAnimationFrame(requestRef.current);
            }
            
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