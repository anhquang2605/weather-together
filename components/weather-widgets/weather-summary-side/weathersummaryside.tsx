import { useEffect, useState } from "react";
import  WeatherAnimatedIcon  from "../pluggins/weather-animated-icon/weatheranimatedicon";
import WeatherDailyTable from "../pluggins/weather-daily-table/weatherDaillyTable";
import WeatherSummary from "../weather-summary/weathersummary";
import { useSession } from "next-auth/react";
import { Value } from "../../../types/WeatherData";
interface WeatherSummarySideProps {

}
export default function WeatherSummarySide() {
    const [curWeather,setCurWeather] = useState<any>(null);
    const [listOfDailyWeather, setListOfDailyWeather] = useState<Value[]>([]);//[
    const {data: session} = useSession();
    const user = session?.user ;
    const location = user?.location;
    useEffect(()=>{
        const weatherData = require('../../../data/mock-weather.json');
        const data:any = Object.values(weatherData.locations)[0];
        setCurWeather(data.currentConditions);
        setListOfDailyWeather(data.values);
    },[])
    return (
        <>
        {location && <div className="weather-summary-side h-full ml-4 glass grow-0">
            <WeatherAnimatedIcon />
            <h5>{location.city}</h5>
            <WeatherSummary currentConditions={curWeather ?? null} />
            <WeatherDailyTable listOfDailyWeather={listOfDailyWeather}/>

        </div>}
        </>
    )
}