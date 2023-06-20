import { getCurrentWeather } from "../../../libs/weather";
import { Location } from "./../../../types/Location";
import WeatherAnimatedIcon from "../pluggins/weather-animated-icon/weatheranimatedicon";
import { useEffect, useState} from "react";
import { useSelector } from "react-redux";
import {CurrentConditions } from "../../../types/WeatherData";
interface WeatherSummaryProps {
    location?: Location,
}
export default function WeatherSummary({location}: WeatherSummaryProps){
    const [curWeather,setCurWeather] = useState<CurrentConditions | null>();
    useEffect(() => {
        getCurrentWeather(location?.city ?? "")
            .then((data) => {
                console.log(data)
                setCurWeather(data)  
            })
            .catch((err) => {
                console.log(err)
            })
    },[])
    return (
        <div className="weather-summary">
            <WeatherAnimatedIcon/>
            <span>{curWeather?.icon?.replace("-", " ")}</span>
            <span>Current Temp {curWeather?.temp}</span>
            <span>Humidity {curWeather?.humidity}</span>
            <span>Wind Speed {curWeather?.wspd}</span>
            <span>Cloud {curWeather?.cloudcover}</span>
        </div>
    )
}