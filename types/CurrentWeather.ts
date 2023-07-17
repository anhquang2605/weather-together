export interface CurrentWeather {
    _id?: string;
    city: string;
    state: string;
    country: string;
    temperature: number;
    status: string;
    timestamp: string;
    post_id?: string;//as soon as post_id created, it will be added to the current weather
}