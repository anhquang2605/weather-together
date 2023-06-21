import Head from 'next/head';
import WeatherSummarySide from '../components/weather-widgets/weather-summary-side/weathersummaryside';
import { useSelector } from 'react-redux';
import { useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';
import ActivityBoard from '../components/activity-board/ActivityBoard';
import Banner from '../components/banner/banner';
export default function Home() {

    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <Banner/>
            <div className="flex">
                <h1 className="hidden">Home</h1>
                
                {/* Banner */}
                <ActivityBoard />
                {<WeatherSummarySide />}
            </div>
        </>
    )
}