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
        {location && <div className="weather-summary-side bg-gradient-to-br from-slate-500/20 from-10% to-transparent to-95% backdrop-blur-lg rounded shadow p-4 grow-0">
            <WeatherAnimatedIcon />
            <h5>{location.city}</h5>
            <WeatherSummary location={location ?? null} />
            <WeatherDailyTable listOfDailyWeather={[]}/>

        </div>}
        </>
    )
}