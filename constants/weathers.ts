import { Weather } from "../types/Weather";

export const WEATHERS: Weather[] = [
    {
        name: "sunny",
        iconAlias: "sun"
    },
    {
        name: "cloudy",
        iconAlias: "cloud"
    },
    {
        name: "rainy",
        iconAlias: "cloud-rain"
    },
    {
        name: "snowy",
        iconAlias: "snowflake"
    },
    {
        name: "windy",
        iconAlias: "wind"
    },
    {
        name: "rainbow",
        iconAlias: "rainbow"
    },
    {
        name: "thunderstorm",
        iconAlias: "bolt"
    }
]
interface weathersMap {
    [key: string]: string;
}

export const weatherToColorClassMap:weathersMap = {
    "sunny": "text-orange-400",
    "cloudy": "text-sky-400" ,
    "rainy": "text-indigo-400" ,
    "snowy": "text-blue-400",
    "thunder": "text-yellow-400" ,
    "windy": "text-green-400" ,
}
export const weatherNameToIconAliasMap:weathersMap = {
    "sunny": "sun",
    "cloudy": "cloud" ,
    "rainy": "cloud-rain" ,
    "snowy": "snowflake",
    "thunder": "bolt" ,
    "windy": "wind" ,
}