import React, { useEffect, useState } from 'react';
import style from './weather-spinner.module.css';
import anime from 'animejs';
import Cloudy from './animations/Cloudy/Cloudy.tsx';
import Sunny from './animations/Sunny/Sunny.tsx';
import Windy from './animations/Windy/Windy.tsx';

interface WeatherSpinnerProps {
}

const WeatherSpinner: React.FC<WeatherSpinnerProps> = () => {
    const [startRain, setStartRain] = useState(false);
    const [startWind, setStartWind] = useState(false);
    const [startSun, setStartSun] = useState(false);
    const [rainFinished, setRainFinished] = useState(true);
    const [windFinished, setWindFinished] = useState(true);
    const [sunFinished, setSunFinished] = useState(true);
    const startAnimation = () => {
        const timeline = anime.timeline({});
    }

    useEffect(()=> {
        setStartRain(true);
    },[])
    useEffect(() => {
        if(sunFinished){
            setWindFinished(false);
            setStartRain(true);
            setStartSun(false);
        }
    }, [sunFinished]);
    useEffect(() => {
        if(rainFinished){
            setSunFinished(false);
            setStartWind(true);
            setStartRain(false);
        }
    }, [rainFinished]);
    useEffect(() => {
        if(windFinished){
            setRainFinished(false);
            setStartSun(true);
            setStartWind(false);
        }
    }, [windFinished]);
    return (
        <div className={style['weather-spinner']}>
            <Cloudy toStart={startRain} setCloudyFinished={setRainFinished}/>
            <Sunny toStart={startSun} setSunnyFinished={setSunFinished}/>
            <Windy toStart={startWind} setWindyFinished={setWindFinished}/>
            <div className={style['weather-spinner__text']}>
                <h1>Loading</h1>
            </div>
        </div>
    );
};

export default WeatherSpinner;