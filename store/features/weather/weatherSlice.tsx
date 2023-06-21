import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';

const weatherHourlyAdapter = createEntityAdapter();
const weatherDailyAdapter = createEntityAdapter();

const initialDailyState = weatherDailyAdapter.getInitialState({
    status: 'idle',
    error: null,
    data: null,
})
const initialHourlyState = weatherHourlyAdapter.getInitialState({
    status: 'idle',
    error: null,
    data: null,
})

const API_HOST = process.env.NEXT_PUBLIC_WEATHER_API_HOST;
const API_BASE_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-host': API_HOST || "",
        'x-rapidapi-key': API_KEY || "",
    },
}
export const fetchWeatherHourly = createAsyncThunk('weather/fetchWeatherHourly', async (city: string) => {
    const response = await fetch(`${API_BASE_URL}/forecast?location=${city}&unitGroup=us&aggregateHours=1&contentType=json&shortColumnNames=1`, options);
    const data = await response.json();
    return data;
});
export const fetchWeatherDaily = createAsyncThunk('weather/fetchWeatherDaily', async (city: string) => {
    const response = await fetch(`${API_BASE_URL}/forecast?location=${city}&unitGroup=us&aggregateHours=24&contentType=json&shortColumnNames=1`, options);
    const data = await response.json();
    return data;
})
const weatherHourlySlice = createSlice({
    name: 'weatherHourly',
    initialState : initialHourlyState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchWeatherHourly.fulfilled, (state, action) => {
            weatherHourlyAdapter.setAll(state, action.payload);
        });
    }
});
const weatherDailySlice = createSlice({
    name: 'weatherDaily',
    initialState :  initialDailyState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchWeatherDaily.fulfilled, (state, action) => {
            weatherDailyAdapter.setAll(state, action.payload);
        });
    }
});
export const selectAllWeather = (state: any) => state.data;
export const {reducer: weatherHourlyReducer} = weatherHourlySlice;
export const {reducer: weatherDailyReducer} = weatherDailySlice;