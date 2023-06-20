import Head from 'next/head';
import WeatherSummarySide from '../components/weather-widgets/weather-summary-side/weathersummaryside';
export default function Home() {
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <h1>Home</h1>
            <WeatherSummarySide />
        </>
    )
}