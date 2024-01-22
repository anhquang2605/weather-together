import { useEffect, useState } from "react";
import  WeatherAnimatedIcon  from "../pluggins/weather-animated-icon/weatheranimatedicon";
import WeatherDailyTable from "../pluggins/weather-daily-table/weatherDaillyTable";
import WeatherSummary from "../weather-summary/weathersummary";
import { useSession } from "next-auth/react";
import { Value } from "../../../types/WeatherData";
import { useWeatherContext } from "../../../pages/weatherContext";
interface WeatherSummarySideProps {

}
export default function WeatherSummarySide() {
    const {curWeather, weeklyWeather, setCurWeather, setWeeklyWeather, getWeatherData} = useWeatherContext();
    const {data: session} = useSession();
    const user = session?.user ;
    const location = user?.location;
    return (
        <>
        {location && <div className="weather-summary-side h-full ml-4 glass grow-0">
            <WeatherAnimatedIcon />
            <h5>{location.city}</h5>
            <WeatherSummary currentConditions={curWeather} />
            <WeatherDailyTable listOfDailyWeather={weeklyWeather}/>

        </div>}
        </>
    )
}