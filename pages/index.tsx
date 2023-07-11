import Head from 'next/head';
import WeatherSummarySide from '../components/weather-widgets/weather-summary-side/weathersummaryside';
import ActivityBoard from '../components/activity-board/ActivityBoard';
import Banner from '../components/banner/banner';
import { useEffect } from 'react';
export default function Home() {

    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <div className="center w-full">
                <Banner/>
                <ActivityBoard/>
            </div>
            <div className="right-side">
                {<WeatherSummarySide />}
            </div>
        </>
    )
}