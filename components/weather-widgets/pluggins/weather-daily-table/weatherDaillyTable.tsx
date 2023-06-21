import { Value } from "../../../../types/WeatherData"
import {useSelector, useDispatch} from "react-redux"
import { fetchWeatherDaily, selectAllWeatherDaily} from "../../../../store/features/weather/weatherSlice"
import { use, useEffect } from "react"
import { AppDispatch } from "../../../../store/store"
interface WeatherDailyTableProps {
    listOfDailyWeather: Value[]
}
export default function WeatherDailyTable ({listOfDailyWeather}: WeatherDailyTableProps){
    const dispatch = useDispatch<AppDispatch>()
    const weatherInTwoWeeks = useSelector(selectAllWeatherDaily);
    const weatherInAWeek = weatherInTwoWeeks.slice(0,7);
    useEffect(() => {
            dispatch(fetchWeatherDaily("San Jose"))
    },[])
    return (
        <>
            <div className="weather-daily-table flex">
                {weatherInAWeek.map((weather: Value,index: number) => {
                    return (
                        <div className="weather-daily-table-item flex-row">
                            <h5>{index == 0 ? "Today" : (index == 1? "Tomorrow" : getDateInWeek(weather.datetimeStr))}</h5>
                            <h5>{Math.round(weather.temp || 0)}</h5>
                            <h5>{weather.conditions}</h5>
                            <h5>{weather.precip}</h5>
                            <h5>{weather.cloudcover}</h5>
                            <h5>{weather.wspd}</h5>
                            <h5>{weather.wdir}</h5>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export const getDateInWeek = (date: string) => {
    const dateInWeek = new Date(date);
    return dateInWeek.toLocaleDateString("en-US", {weekday: "long"})
}
