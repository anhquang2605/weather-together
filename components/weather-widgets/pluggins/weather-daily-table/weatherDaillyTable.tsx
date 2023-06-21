import { Value } from "../../../../types/WeatherData"
import {useSelector, useDispatch} from "react-redux"
import { fetchWeatherDaily, selectAllWeather } from "../../../../store/features/weather/weatherSlice"
import { use, useEffect } from "react"
import { AppDispatch } from "../../../../store/store"
interface WeatherDailyTableProps {
    listOfDailyWeather: Value[]
}
export default function WeatherDailyTable ({listOfDailyWeather}: WeatherDailyTableProps){
    const dispatch = useDispatch<AppDispatch>()
    const weather = useSelector(state => {
        console.log(state)
    })

    useEffect(() => {

            dispatch(fetchWeatherDaily("San Jose"))
    },[])
    return (
        <>

        </>
    )
}