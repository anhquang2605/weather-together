import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';

const weatherAdapter = createEntityAdapter();

const initialState = weatherAdapter.getInitialState({
    status: 'idle',
    error: null
})
const API_HOST = "https://api.tomorrow.io/v4";
const API_ENDPOINT = "/timelines";
const API_KEY = process.env.WEATHER_API_KEY;
export const fetchWeather = createAsyncThunk('weather/fetchWeather', async (city: string) => {
    const response = await fetch(`${API_HOST}${API_ENDPOINT}?location=${city}&fields=temperature&timesteps=1d&units=metric&apikey=${API_KEY}`);
    const data = await response.json();
    return data;
});

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        weatherAdded: weatherAdapter.addOne,
    },
});

export default weatherSlice.reducer