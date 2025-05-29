interface ZipCode {
    city: string,
    country_code: string,
    latitude: number,
    longitude: number,
    state: string,
    state_code: string,
    postal_code: string,
    province: string | null,
    province_code: string | null
}
const API_KEY = process.env.NEXT_PUBLIC_ZIPCODE_API_KEY;
const API_BASE_URL = process.env.NEXT_PUBLIC_ZIPCODE_API_URL;
const API_HOST = process.env.NEXT_PUBLIC_ZIPCODE_API_HOST;
const options:RequestInit = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': API_KEY ?? '',
        'X-RapidAPI-Host': API_HOST ?? ''
    }
}
export async function getDataByZipcode(zipcode: string, country_code: string){
    const url = `${API_BASE_URL}/summary/${zipcode}`;
    const response = await fetch(url, options);
    const data = await response.json();
    if(data){
        const result = data.results[zipcode];
        return result ? result[0] : null;
    }else {
        return null;
    }

}

export async function getCityFromZipcode(zipcode: string, country_code: string){
    const data = await getDataByZipcode(zipcode, country_code);
    return data ? data.city : null;
}