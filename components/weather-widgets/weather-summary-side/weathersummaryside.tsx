import { useEffect } from "react";
import  WeatherAnimatedIcon  from "../pluggins/weather-animated-icon/weatheranimatedicon";
import WeatherDailyTable from "../pluggins/weather-daily-table/weatherDaillyTable";
import WeatherSummary from "../weather-summary/weathersummary";
import { useSession } from "next-auth/react";
interface WeatherSummarySideProps {

}
export default function WeatherSummarySide() {
    const {data: session} = useSession();
    const user = session?.user ;
    const location = user?.location;
    useEffect  (() => {
        console.log(session, user, location);
    }, [session])
    return (
        <>
        {location && <div className="weather-summary-side h-full ml-4 glass grow-0">
            <WeatherAnimatedIcon />
            <h5>{location.city}</h5>
            <WeatherSummary location={location ?? null} />
            <WeatherDailyTable listOfDailyWeather={[]}/>

        </div>}
        </>
    )
}