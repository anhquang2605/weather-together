import Head from 'next/head';
import WeatherSummarySide from '../components/weather-widgets/weather-summary-side/weathersummaryside';
import { useSelector } from 'react-redux';
import { useEffect, useLayoutEffect } from 'react';
export default function Home() {
    const user = useSelector((state: any) => state.user)
    useEffect(() => {
        if(user === null){
            console.log(user);
            window.location.href = "/login"
        }
    },[])
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <h1>Home</h1>
            {user && <WeatherSummarySide />}
        </>
    )
}