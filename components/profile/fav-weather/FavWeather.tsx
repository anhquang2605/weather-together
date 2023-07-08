import { IconName } from "@fortawesome/fontawesome-svg-core";
import { Weather } from "../../../types/Weather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface FavWeatherProps {
    favWeathers: Weather[] //To change later
}

export default function FavWeather({ favWeathers }: FavWeatherProps) {
    return (
        <>
            <div className="fav-weather">
                {favWeathers?.length && favWeathers.map((weather: Weather, index:number) => {
                    return (
                        <div key={index}>
                            <FontAwesomeIcon icon={['fas', (weather?.iconAlias ?? "") as IconName]}/>
                        </div>
                    )
                    }
                )}
            </div>
        </>
    )
}