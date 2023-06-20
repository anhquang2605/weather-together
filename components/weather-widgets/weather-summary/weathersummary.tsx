import { getCurrentWeather } from "../../../libs/weather";
import { Location } from "./../../../types/Location";
import WeatherAnimatedIcon from "../pluggins/weather-animated-icon/weatheranimatedicon";
import { useEffect} from "react";
interface WeatherSummaryProps {
    location?: Location,
}
export default function WeatherSummary({location}: WeatherSummaryProps){
    useEffect(() => {
        getCurrentWeather('San Jose')
            .then((data) => {
                console.log(data)})
            .catch((err) => {
                console.log(err)
            })
    },[])
    return (
        <div className="weather-summary">
            <h5>Weather summary</h5>
            <WeatherAnimatedIcon/>
        </div>
    )
}