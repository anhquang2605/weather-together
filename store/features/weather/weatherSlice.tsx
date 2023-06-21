import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';
import { Value } from '../../../types/WeatherData';

const weatherHourlyAdapter = createEntityAdapter<Value>({
    selectId: (e:Value) => e.id || 0
});
const weatherDailyAdapter = createEntityAdapter<Value>({
    selectId: (e:Value) => e.id || 0
});

const initialDailyState = weatherDailyAdapter.getInitialState({
    status: 'idle',
    error: null,

})
const initialHourlyState = weatherHourlyAdapter.getInitialState({
    status: 'idle',
    error: null,
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
    const hourlyData = data?.locations?.[city]?.values;
    const withIds= hourlyData.map((e: Value,index: number) => ({
        ...e,
        id: index
}))
return withIds;
});
export const fetchWeatherDaily = createAsyncThunk('weather/fetchWeatherDaily', async (city: string) => {
    const response = await fetch(`${API_BASE_URL}/forecast?location=${city}&unitGroup=us&aggregateHours=24&contentType=json&shortColumnNames=1`, options);
    const data = await response.json();
    const dailyData = data?.locations?.[city]?.values;
    const withIds= dailyData.map((e: Value,index: number) => ({
            ...e,
            id: index
    }))
    return withIds;
})
const weatherHourlySlice = createSlice({
    name: 'weatherHourly',
    initialState : initialHourlyState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchWeatherHourly.fulfilled, (state, action) => {
            
            weatherHourlyAdapter.upsertMany(state, action.payload)
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
            console.log(action.payload)
            weatherDailyAdapter.upsertMany(state, action.payload);
        });
    }
});
export const {
    selectAll: selectAllWeatherHourly,
    selectById: selectWeatherHourlyByDatetimeStr,
    selectIds: selectWeatherHourlyDatimeStr,
} = weatherHourlyAdapter.getSelectors((state: any) => state.weatherHourly);
export const {
    selectAll: selectAllWeatherDaily,
    selectById: selectWeatherDailyByDatetimeStr,
    selectIds: selectWeatherDailyDatimeStr,
} = weatherDailyAdapter.getSelectors((state: any) => state.weatherDaily);

export const {reducer: weatherHourlyReducer} = weatherHourlySlice;
export const {reducer: weatherDailyReducer} = weatherDailySlice;