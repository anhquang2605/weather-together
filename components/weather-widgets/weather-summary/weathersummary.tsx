import { getCurrentWeather } from "../../../libs/weather";
import { Location } from "../../../types/location";
import WeatherAnimatedIcon from "../pluggins/weather-animated-icon/weatheranimatedicon";
import { useEffect, useState} from "react";
import { useSelector } from "react-redux";
import {CurrentConditions } from "../../../types/WeatherData";
import { set } from "lodash";
interface WeatherSummaryProps {
    currentConditions: CurrentConditions | null;
}
export default function WeatherSummary({currentConditions}: WeatherSummaryProps){
    const [curWeather,setCurWeather] = useState<CurrentConditions | null>(currentConditions);
    useEffect(() => {
        /* getCurrentWeather(location?.city ?? "")
            .then((data) => {
                setCurWeather(data)  
            })
            .catch((err) => {
                console.log(err)
            }) */
        //get mock weather data from data folder, this mock weather is a json file, name this json as WeatherData
        //import the mock weather data from data folder


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