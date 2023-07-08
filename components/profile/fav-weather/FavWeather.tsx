import { Weather } from "../../../types/Weather";

interface FavWeatherProps {
    favWeathers: Weather[] //To change later
}

export default function FavWeather({ favWeathers }: FavWeatherProps) {
    return (
        <>
            <div className="fav-weather glass">
                {favWeathers.map((weather: Weather, index:number) => {
                    return (
                        <div key={index}>
                            {weather.name}
                        </div>
                    )
                    }
                )}
            </div>
        </>
    )
}