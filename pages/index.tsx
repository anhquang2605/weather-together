import Head from 'next/head';
import WeatherSummarySide from '../components/weather-widgets/weather-summary-side/weathersummaryside';
import { useSelector } from 'react-redux';
import { useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';
export default function Home() {

    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <h1>Home</h1>
            {<WeatherSummarySide />}
        </>
    )
}