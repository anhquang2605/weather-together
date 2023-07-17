import style from './share-weather-button.module.css'
import { getCurrentWeather } from '../../../../../libs/weather';
import { useSelector } from 'react-redux';
import { useState } from 'react';
interface ShareWeatherButtonProps {
    setCurrentWeather: React.Dispatch<React.SetStateAction<any>>;
    username?: string;
}
/*
Get current weather, then apply different style for the button, animation and icon
*/
export default function ShareWeatherButton({ setCurrentWeather,username }: ShareWeatherButtonProps) {
    const [weather, setWeather] = useState<any>(null);
    //const user = useSelector((state:any) => state.user);
    const handleShareWeather = async () => {
        const condition = await getCurrentWeather('San Jose');
        setWeather(condition);
        setCurrentWeather(weather);
    }
    const handleGetWeather = async () => {

    }
    return(
        <div className={style['share-weather-btn-container']}>
            <div className={style['share-weather-btn-background'] + " " +style[weather.icon] }></div>
            <button className={style['share-weather-btn']} onClick={handleShareWeather}>
                <span className={style["weather-text"]}>
                    {weather?
                            `Feeling the ${weather.icon.replace("-"," ")}`
                        :
                        
                            "Spill the weather!"
                    }
                </span>
            </button>
        </div>
    )
}