import { Weather } from "../types/Weather";

export const WEATHERS: Weather[] = [
    {
        name: "sunny",
    },
    {
        name: "cloudy",
    },
    {
        name: "rainy",
    },
    {
        name: "snowy",
    },
    {
        name: "windy",
    },
    {
        name: "thunder",
    }
]
interface weathersMap {
    [key: string]: string;
}

export const weatherToColorClassMap:weathersMap = {
    "sunny": "text-orange-300",
    "cloudy": "text-sky-300" ,
    "rainy": "text-indigo-300" ,
    "snowy": "text-blue-300",
    "thunder": "text-yellow-300" ,
    "windy": "text-green-300" ,
}
export const weatherNameToIconAliasMap:weathersMap = {
    "sunny": "sun",
    "cloudy": "cloud" ,
    "rainy": "cloud-rain" ,
    "snowy": "snowflake",
    "thunder": "bolt" ,
    "windy": "wind" ,
}
