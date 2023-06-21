import  WeatherAnimatedIcon  from "../pluggins/weather-animated-icon/weatheranimatedicon";
import WeatherDailyTable from "../pluggins/weather-daily-table/weatherDaillyTable";
import WeatherSummary from "../weather-summary/weathersummary";
import { useSelector } from "react-redux";
interface WeatherSummarySideProps {

}
export default function WeatherSummarySide() {
    const user = useSelector((state: any) => state.user)
    const {location} = user?.data ?? {location: undefined};

    return (
        <>
        {location && <div className="weather-summary-side">
            <WeatherAnimatedIcon />
            <WeatherSummary location={location ?? null} />
            <WeatherDailyTable listOfDailyWeather={[]}/>
            <h5>{location.city}</h5>
        </div>}
        </>
    )
}