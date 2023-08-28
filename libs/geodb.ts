import { format } from "path";
export interface City{
    id: number
    wikiDataId: string
    type: string
    city: string
    name: string
    country: string
    countryCode: string
    region: string
    regionCode: string
    latitude: number
    longitude: number
    population: number
      
}
const CITIES_ENDPOINTS = 'v1/geo/cities';
const NEIGHBOR_CITIES_ENDPOINTS = 'v1/geo/cities/Q60/nearbyCities';

const KEY = process.env.NEXT_PUBLIC_GEODB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_GEODB_API_URL;
const HOST = process.env.NEXT_PUBLIC_GEODB_API_HOST;

const options = {
    method: 'GET',
    headers:{
        'X-RapidAPI-Key': KEY ?? '',
        'X-RapidAPI-Host': HOST ?? ''
    }
}
const format_lat_long = (lat: string, lon: string)  => {
    try {
        const latSplited = lat.split('.');
        const lonSplited = lon.split('.');
        const latNumber = latSplited[0];
        const latDecimal = latSplited[1];
        const lonNumber = lonSplited[0];
        const lonDecimal = lonSplited[1];
        const latFormated = `${latNumber}.${latDecimal.substring(0, 4)}`;
        const lonFormated = `${lonNumber}.${lonDecimal.substring(0, 4)}`;
        return `${parseInt(latNumber) > 0 ? '+' : ''}${latFormated}${parseInt(lonNumber) > 0 ? '+' : ''}${lonFormated}`

    } catch (e) {
        return "Invalid Input";
    }

}
export function generateNearByPathByCityId(cityId: string){
    return `${BASE_URL}/v1/geo/cities/${cityId}/nearbyCities`;
}
export async function getCitiesFromLongLat(latitue:string, longitude: string, radius: string){
  const params: URLSearchParams = new URLSearchParams(
        {
            location: format_lat_long(latitue, longitude),
            radius,
            distanceUnit: 'MI',
        }
    );
    const url = `${BASE_URL}/${CITIES_ENDPOINTS}?${params.toString()}`;
    try{
        const response = await fetch(url, options);
        const data = await response.json();
        return data.data as City[];
    }catch(e){
        console.log(e);
        return [];
    }
}

export async function getCityIdBasedOnLongLatName(latitue: string, longitude: string, radius: string, cityName: string){
    const cities = await getCitiesFromLongLat(latitue, longitude, radius);
    const city = cities.find((city:City) => city.name === cityName);
    return city?.id;
}
export async function getNearbyCities(cityId: string, radius: string){
    let url = generateNearByPathByCityId(cityId);
    const params: URLSearchParams = new URLSearchParams(
        {
            radius,
            limit: '10',
        }
    )
    url = `${url}?${params.toString()}`;
    try{
        const response = await fetch(url, options);
        const data = await response.json();
        return data.data as City[];
    }catch(e){
        console.log(e);
        return [];
    }
}
export async function getNearbyCityNamesByLongLatName(latitue: string, longitude: string, radius: string, cityName: string){
    let cities: City[] = [];
    const cityId = await getCityIdBasedOnLongLatName(latitue, longitude, radius, cityName);
    if(cityId){
        cities = await getNearbyCities(cityId?.toString() , radius);
    }
    let cityNames = cities.map((city: City) => city.name);
    cityNames.push(cityName);
    return cityNames;
}