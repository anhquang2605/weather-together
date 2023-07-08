import { IconName } from "@fortawesome/fontawesome-svg-core";
import { Weather } from "../../../types/Weather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface FavWeatherProps {
    favWeathers: Weather[] //To change later
}
interface colorsToClassMap {
    [key: string]: string;
}

let weatherToClassMap:colorsToClassMap = {
    "sunny": "text-orange-400",
    "cloudy": "text-sky-400" ,
    "rainy": "text-indigo-400" ,
    "snowy": "text-blue-400",
    "thunder": "text-yellow-400" ,
    "windy": "text-green-400" ,
}

export default function FavWeather({ favWeathers }: FavWeatherProps) {
    return (
        <>

            <div className="fav-weather flex flex-row lg:w-48 w-32 justify-between items-center border p-2 rounded-3xl mt-2 mr-auto border-slate-400">
                <FontAwesomeIcon className="lg:text-3xl text-xl text-rose-500" icon={['fas', 'heart']} />
                {favWeathers?.length && favWeathers.map((weather: Weather, index:number) => {
                    const colorsClass = weatherToClassMap[weather.name]
                    return (
                        
                        <div className="lg:text-xl text-md " key={index}>
                            <FontAwesomeIcon  className={colorsClass}  icon={['fas', (weather?.iconAlias ?? "") as IconName]}/>
                        </div>
                    )
                    }
                )}
            </div>
        </>
    )
}