import  WeatherAnimatedIcon  from "../pluggins/weather-animated-icon/weatheranimatedicon";
import WeatherSummary from "../weather-summary/weathersummary";
interface WeatherSummarySideProps {

}
export default function WeatherSummarySide() {
    return (
        <div className="weather-summary-side">
            <WeatherAnimatedIcon />
            <WeatherSummary />
            <h5>Weather summary side</h5>
        </div>
    )
}