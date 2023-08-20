import { format } from "path";

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
        const cities = data.data.map((city: any) => {
            return {
                name: city.name,
                lat: city.latitude,
                lon: city.longitude,
            }
        })
        return cities;
    }catch(e){
        console.log(e);
        return [];
    }


}