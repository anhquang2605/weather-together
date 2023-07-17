import style from './share-weather-button.module.css'
import { getCurrentWeather } from '../../../../../libs/weather';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { TbCloudFilled } from "react-icons/tb";
import { convertConditionToIconName } from '../../../../../libs/weather';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        if(weather){
            setWeather(null);
            setCurrentWeather(null);
        }else{
            const condition = await getCurrentWeather('San Jose');
            setWeather(condition);
            setCurrentWeather(weather);
        }

    }
    const handleGetWeather = async () => {

    }
    return(
        <div className={style['share-weather-btn-container']}>
            <div 
                className={style['share-weather-btn-background'] 
                + " " + (weather && style[convertConditionToIconName(weather?.icon)])
                + " " + (weather && style['weather-shared'])
                }></div>
            <button className={style['share-weather-btn']} onClick={handleShareWeather} 
            title={weather? "Remove weather" : "Share weather"}
            >
                <span className={style["weather-text"]}>
                    {
                    weather && weather.icon?
                            
                            <>
                                 <FontAwesomeIcon icon={convertConditionToIconName(weather.icon)} className={"icon mr-2 "+ style[convertConditionToIconName(weather.icon)]}/>
                                 feeling the {weather.icon.replace("-"," ")}
                            </>
                        :
                        
                            <><TbCloudFilled className="icon mr-2"/> Your weather! </>
                    }
                </span>
            </button>
        </div>
    )
}