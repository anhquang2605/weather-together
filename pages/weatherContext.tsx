import { createContext, use, useContext, useEffect, useState } from "react";
import { CurrentConditions, Value } from "../types/WeatherData";
import { getWeather } from "../libs/weather";

interface WeatherContextProviderProps {
    children: React.ReactNode
}

export interface WeatherContextType {
    curWeather: CurrentConditions | null;
    weeklyWeather: Value[];
    setCurWeather: (weather: CurrentConditions | null) => void;
    setWeeklyWeather: (weather: Value[]) => void;
    getWeatherData: (location: string) => void;//return weather Data from API, and set the state of context
}

export const WeatherContext = createContext<WeatherContextType | null>(
null);

export const WeatherContextProvider = ({children}: WeatherContextProviderProps) => {
    const [curWeather, setCurWeather] = useState<CurrentConditions | null>(null);
    const [weeklyWeather, setWeeklyWeather] = useState<Value[]>([]);
    const getWeatherData = async (location: string) => {
        const weatherData = require('../data/mock-weather.json');
        const data:any = Object.values(weatherData.locations)[0];
        setCurWeather(data.currentConditions);
        setWeeklyWeather(data.values);
/*         getWeather(location).then((data) => {
            if(data){
                const locations = Object.values(data.locations);
                const location = locations[0];
                setWeeklyWeather(location.values.slice(0,7));
                setCurWeather(location.currentConditions);
            }
        }).catch((err) => {
            console.log(err)
        }) */
    }
    return (
        <WeatherContext.Provider value={{ getWeatherData, curWeather, weeklyWeather, setCurWeather, setWeeklyWeather }}>
            {children}
        </WeatherContext.Provider>
    )
}

export const useWeatherContext = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error('useWeatherContext must be used within WeatherContextProvider')
    }
    return context;
}
