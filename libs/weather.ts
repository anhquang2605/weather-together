import { WeatherData } from "../types/WeatherData";
import * as weather from './../test.json';
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const API_BASE_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;
const API_HOST = process.env.NEXT_PUBLIC_WEATHER_API_HOST;
const CONTENT_TYPE = 'json';
const SHORT_COLUMN_NAMES = 1;
const UNIT_GROUP = 'us';
let totalWeatherData:WeatherData | null;
const options:RequestInit = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': API_KEY ?? '',
        'X-RapidAPI-Host': API_HOST ?? ''
    }
}
async function generateURL(locationName: string, timeRate:number, unitGroup:string){
    return `${API_BASE_URL}/forecast?aggregateHours=${timeRate}&location=${encodeURI(locationName)}&contentType=${CONTENT_TYPE}&unitGroup=${unitGroup}&shortColumnNames=${SHORT_COLUMN_NAMES}`;
}

export default async function getWeatherDataByTime(locationName: string, timeRate: number, unitGroup: string){
    const URL = await generateURL(locationName, timeRate, unitGroup = UNIT_GROUP);
    try {
/*         const reponse = await fetch(URL, options);
        const data = await reponse.text(); */
        const data = weather;
        return data;
    } catch (error) {
        return null;
    }
}

export async function getCurrentWeather(locationName: string){
    totalWeatherData = await getWeatherDataByTime(locationName, 1, 'us') ;
    return totalWeatherData ? totalWeatherData.locations[locationName].currentConditions : null;
}

