import React, { use, useEffect, useRef, useState } from 'react';
import style from './fav-weather-wheel.module.css';
import WeatherIcon from '../../weather-widgets/pluggins/weather-icon/WeatherIcon';
import {WEATHERS, weatherToColor} from '../../../constants/weathers';
import { remove } from 'lodash';

interface FavWeatherWheelProps {
    weatherName: string;
    isEditable?: boolean;
    size: string;
    setFeaturedWeather: (value: string) => void
}
/**
 * This component is used to display the favorites weathers options when they want to edit their favorite weathers
 */
const FavWeatherWheel: React.FC<FavWeatherWheelProps> = ({size, weatherName, isEditable, setFeaturedWeather}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [chosen, setChosen] = useState<string>("");
    const [favIconSize, setFavIconSize] = useState<string>('large');
    const SPEED = 0.5; // Degrees to move per frame
    const OFFSET_ANGLE = 10;
    const optionsRef = useRef<HTMLCollectionOf<HTMLElement> | null>(null); //
    const requestRef = useRef<number>(0);
    const timeRef = useRef<number>(0);
    const containerCenterRef = useRef<number[]>([0,0]);
    const currentAngleRef = useRef<number>(0);
    const optionSizeRef = useRef<number[]>([0,0]);//option width and height
    const optionAngleRef = useRef<number>(0);//angle for each option to make sure that they are not overlapping on the circular path
    const weatherOptionRef = useRef<HTMLElement|null>(null);//options collection
    const optionsAngleStoreRef = useRef<number[]>([]);
    const currentReversingOptionIndexRef = useRef<number>(0);
    const chosenWeatherIndexRef = useRef<number>(9999);
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
    //ANIMATION LOGICS
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
        const addedAngle = elapsedTime * SPEED;
        const len = optionsElements.length;
        // Calculate the current angle based on the elapsed time
/*         let currentAngle = Math.round(Math.min(addedAngle + currentAngleRef.current , totalDegrees)); */
        let currentAngle = addedAngle + currentAngleRef.current;
        /*   if (currentAngle >= totalDegrees) {
            return; // Stop the animation when the target degrees are reached
        } */
        
        if(addedAngle > len * optionAngleRef.current ){
            optionsAngleStoreRef.current[len - 1] = addedAngle;
           return;
       }
     /* 
            let start = 1;
            let endSignal = len + 1 ; */
        /* if(directionRef.current === -1){
            start = len - 1;
            endSignal = 0;
        } */
/*         while(start !== endSignal){
            const currentOptionAngle = start * optionAngleRef.current;
            console.log(currentOptionAngle);
            if( currentOptionAngle < currentAngle){
                    start += 1;
                    continue;   
                }

            // if( start < optionsDistributed - 1){
             //   start += 1;
              //  continue;
            //}     

            const object = optionsElements[start - 1];
                const x = Math.round(rX + (radius * Math.cos(currentAngle * (Math.PI / 180)))) - optionW;
                const y = Math.round(rY + (radius * Math.sin(currentAngle * (Math.PI / 180)))) - optionH;
                object.style.left = `${x}px`; // Offset to center the object
                object.style.top = `${y}px`;
                
                start += 1;
        } */
    
        
         //Animation must be applied for each object, we should path animatin 

         for (let i = 1; i <= len ; i++) {
            if(i === chosenWeatherIndexRef.current + 1){
                continue;
            }
            if(i * optionAngleRef.current < addedAngle){
                if(!optionsAngleStoreRef.current[i - 1]){
                    optionsAngleStoreRef.current[i - 1] = currentAngle;
                }
                continue;
            }
            const object = optionsElements[i - 1];
            const x = Math.round(rX + (radius * Math.cos(currentAngle * (Math.PI / 180)))) - optionW;
            const y = Math.round(rY + (radius * Math.sin(currentAngle * (Math.PI / 180)))) - optionH;
            object.style.left = `${x}px`; // Offset to center the object
            object.style.top = `${y}px`;
        } 
        // Calculate the position based on the current angle
        // Increase the angle for the next frame
        // Continue the animation
        requestRef.current = requestAnimationFrame(moveObject);
    }
    function reverseMoveObject(timestamp: number) {
        if(!optionsRef.current){
            return;
        }
    
        const optionsElements: HTMLCollectionOf<HTMLElement> = optionsRef.current;
        let len = optionsElements.length;
        if(currentReversingOptionIndexRef.current >= len){
            const options = document.getElementsByClassName(style['weather-options'])[0] as HTMLElement;
            addPulseClass();
            
            options.style.visibility  = 'hidden';
            return;
        }
        const radius = containerCenterRef.current[0];
        const rX = containerCenterRef.current[0];
        const rY = containerCenterRef.current[1];
        const optionW = optionSizeRef.current[0] / 2;
        const optionH = optionSizeRef.current[1] / 2;

       
        let startTime = timeRef.current;
        if (timeRef.current === 0) {
            timeRef.current = timestamp;
            startTime = timestamp;
        }
        // Calculate the elapsed time
        const elapsedTime = Math.round(timestamp - startTime);
        const addedAngle = elapsedTime * SPEED * 1.75 ;
        const currentOption = currentReversingOptionIndexRef.current;
        const currentOptionAngle = optionsAngleStoreRef.current[currentOption];
        
        // Calculate the current angle based on the elapsed time
/*         let currentAngle = Math.round(Math.min(addedAngle + currentAngleRef.current , totalDegrees)); */
        let currentAngle = Math.round(currentOptionAngle - addedAngle);
        
        if(currentAngle <= (currentAngleRef.current - 15)){
            timeRef.current = 0;
            currentReversingOptionIndexRef.current += 1;
        } else {
            const object = optionsElements[currentOption];
            const x = Math.round(rX + (radius * Math.cos(currentAngle * (Math.PI / 180)))) - optionW;
            const y = Math.round(rY + (radius * Math.sin(currentAngle * (Math.PI / 180)))) - optionH;
            object.style.left = `${x}px`; // Offset to center the object
            object.style.top = `${y}px`;
        }
        
        // Calculate the position based on the current angle
        // Increase the angle for the next frame
        // Continue the animation
        requestRef.current = requestAnimationFrame(reverseMoveObject);

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
        const favWeatherWheel = document.getElementsByClassName(style['fav-weather-wheel'])[0];
        const featuredWeather = document.getElementsByClassName(style['featured-weather'])[0];
        if(!featuredWeather || !favWeatherWheel){
            return [0,0];
        }
        const {left, top} = featuredWeather.getBoundingClientRect();
        const {left: left1, top: top1} = favWeatherWheel.getBoundingClientRect();
        const leftR = left - left1;
        const topR = top - top1;
        return [leftR, topR];
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
        removePulseClass();
        const rotatePos = getCurrentRotatePosition();
        const angle = Math.ceil(getAngle(rotatePos[0], rotatePos[1]));
        const optionSize = getOptionSize();
        const centerSize = getContainerCenter(style['fav-weather-wheel']);
        currentAngleRef.current = angle + OFFSET_ANGLE;
        timeRef.current = 0;
        optionSizeRef.current = optionSize;
        optionAngleRef.current = Math.ceil(getAngleOption(centerSize[0], optionSize[0]));
        containerCenterRef.current = centerSize;
    }
    const toggleZeroDelayClass = (on: boolean) => {
        const featWeather = document.getElementsByClassName(style['featured-weather'])[0];
        const delayTime = 450; //ms
        if(featWeather && !on){
            const timeout = setTimeout(() => {
                featWeather.classList.add(style['zero-delay']);
            }, delayTime);
            return timeout;
        } else if(featWeather && on){
            featWeather.classList.remove(style['zero-delay']);
            return null;
        }
    }
    const addPulseClass = () => {
        const featWeather = document.getElementsByClassName(style['featured-weather'])[0];
        if(featWeather){
            featWeather.classList.add(style['pulse']);
        }
    }
    const removePulseClass = () => {
        const featWeather = document.getElementsByClassName(style['featured-weather'])[0];
        if(featWeather){
            featWeather.classList.remove(style['pulse']);
        }
    }
    const delayUpdateChosenWeather = (weather: string) => {
        const delayTime = 550; //ms
        const timeout = setTimeout(() => {
            setFeaturedWeather(weather);
        }, delayTime);
        return timeout;
    }
    const handleOptionClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        console.log(target);
        target.classList.add(style['active-option']);
    }
    useEffect(()=>{
        if(optionsRef){
            optionsRef.current = getOptionsElement();
        }
        if(timeRef){
            timeRef.current = 0;
        }
    },[])

    //What next?
    /* 

    */
    useEffect(() => {
       
        //get reference to the options
        const weatherOptionsElement = weatherOptionRef.current = document.getElementsByClassName(style['weather-options'])[0] as HTMLElement;
        weatherOptionRef.current = weatherOptionsElement;
        let timeout = null;        
        if(isExpanded){            
            timeout = toggleZeroDelayClass(true);
            initiatingAnimation();
            weatherOptionsElement.style.visibility = 'visible';
            requestRef.current = requestAnimationFrame(moveObject);
            
        }else if(!isExpanded && currentAngleRef.current) {
            timeout = toggleZeroDelayClass(false);
            weatherOptionsElement.classList.add(style['no-interaction']);
            currentReversingOptionIndexRef.current = 0;
            timeRef.current = 0;
            requestRef.current = requestAnimationFrame(reverseMoveObject);    
        }
        return () => {
            if(timeout){
                clearTimeout(timeout);
            }
            cancelAnimationFrame(requestRef.current);
        }
    },[isExpanded])
    useEffect(() => {
        let timeout = null;
        if(chosen !== ""){
            timeout = delayUpdateChosenWeather(chosen);    
        }
        return () => {
            if(timeout){
                clearTimeout(timeout);
            }
        }
    },[chosen])
    /*
    Swapping fave weather choice to indicate the change
    _ The featured will have the circle expand then shrink back for a brief moment with color change of the border to match with the new weather.
    _ each weather class will now also have a color associated with it, this can be edit using a file of colors to match with the weather name for now, preferably online with the weather api or database but this can be expensive to implement
    */
    return (
        <div  className={style['fav-weather-wheel']} onClick={handleToggle}>
                    <div title={
                        isExpanded ? '' : 'Click to change your favorite weather'
                    } className={`${style['pulse']} ${style['featured-weather']} 
                    ${
                            isEditable ? style['editable-featured'] : ''
                    } 
                    ${
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

                    <div className={` ${style['weather-options']} ${isExpanded ? style['expanded-options'] : ''} `}>
                        {
                            WEATHERS.map((weather, index) => {
                                if(weather.name === weatherName){
                                    return null;
                                } 
                                return (
                                    <div
                                        className={`${style['weather-option']} `}
                                        style={{
                                            outlineColor: weatherToColor[weather.name]
                                        }}
                                        key={weather.name}
                                        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                                            {handleOptionClick(event);
                                            setChosen(weather.name)}}
                                    >
                                        
                                        <WeatherIcon
                                            weatherName={weather.name}
                                            size={shortDimension(favIconSize)}
                                        />
                                        <div className={`${style['bg-overlay']}`} style={{backgroundColor: weatherToColor[weather.name]}}>
                                        </div>
                                    </div>
                                );
                                
                            })
                        }
                    </div>
        </div>
    );
};

export default FavWeatherWheel;