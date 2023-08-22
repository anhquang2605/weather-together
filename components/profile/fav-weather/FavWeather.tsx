import { IconName } from "@fortawesome/fontawesome-svg-core";
import { Weather } from "../../../types/Weather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { weatherNameToIconAliasMap, weatherToColorClassMap } from "../../../constants/weathers";
interface FavWeatherProps {
    favWeathers: Weather[] //To change later
}


export default function FavWeather({ favWeathers }: FavWeatherProps) {
    return (
        <>

            <div className="fav-weather flex flex-row lg:w-48 w-32 justify-between items-center border p-2 rounded-3xl mr-auto border-slate-400">
                <FontAwesomeIcon className="lg:text-3xl text-xl text-rose-500" icon={['fas', 'heart']} />
                {favWeathers?.length && favWeathers.map(({name}:Weather, index:number) => {
                    const colorsClass = weatherToColorClassMap[name]
                    return (
                        
                        <div className="lg:text-xl text-md " key={index}>
                            <FontAwesomeIcon  className={colorsClass}  icon={['fas', (weatherNameToIconAliasMap[name]) as IconName]}/>
                        </div>
                    )
                    }
                )}
            </div>
        </>
    )
}