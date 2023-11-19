import style from './share-weather-button.module.css'
import { getCurrentWeather } from './../../../../../../libs/weather';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { TbCloudFilled } from "react-icons/tb";
import { convertConditionToIconName } from './../../../../../../libs/weather';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
interface ShareWeatherButtonProps {
    setCurrentWeather: React.Dispatch<React.SetStateAction<any>>;
    username?: string;
    currentWeather:any
}
/*
Get current weather, then apply different style for the button, animation and icon
*/
export default function ShareWeatherButton({ setCurrentWeather, currentWeather}: ShareWeatherButtonProps) {
    const [weather, setWeather] = useState<any>(currentWeather);
    const {data: session} = useSession();
    const user = session?.user;
    //const user = useSelector((state:any) => state.user);

    const handleShareWeather = async () => {
        if(weather){
            setWeather(null);
            setCurrentWeather(null);
        }else{
            //need to be the user location, will pop up with the warning saying that the user will consent the app to have the location of the user
            const condition = await getCurrentWeather(user?.location?.city || "");
            setWeather(condition);
            setCurrentWeather(condition);
        }

    }
    useEffect(()=>{
        console.log(currentWeather);
    },[])
    return(
        <>
            <Head>
                <link rel="stylesheet" href="https://i.icomoon.io/public/temp/d5becd3a0d/UntitledProject/style.css"/>
            </Head>
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
                                    <FontAwesomeIcon icon={convertConditionToIconName(weather.icon)} className={"icon mr-2 animate-bounce "+ style[convertConditionToIconName(weather.icon)]}/>
                                    feeling the {weather.icon.replace("-"," ")}
                                </>
                            :
                            
                                <><i className={style["icon-cloud"] + " icon-cloud-sun text-2xl"}></i> Your weather </>
                        }
                    </span>
                </button>
            </div>
        </>
    )
}