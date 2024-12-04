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
    "sunny": "text-orange-400",
    "cloudy": "text-sky-400" ,
    "rainy": "text-indigo-400" ,
    "snowy": "text-blue-400",
    "thunder": "text-yellow-400" ,
    "windy": "text-lime-400" ,
}
export const weatherNameToIconAliasMap:weathersMap = {
    "sunny": "sun",
    "cloudy": "cloud" ,
    "rainy": "cloud-rain" ,
    "snowy": "snowflake",
    "thunder": "bolt" ,
    "windy": "wind" ,
}

export const weatherToColor: weathersMap = {
    "sunny": "#fb923c",
    "cloudy": "#38bdf8",
    "rainy": "#818cf8",
    "snowy": "#60a5fa",
    "thunder": "#facc15",
    "windy": "#a3e635",
}