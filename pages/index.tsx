import Head from 'next/head';
import WeatherSummarySide from '../components/weather-widgets/weather-summary-side/weathersummaryside';
import ActivityBoard from '../components/activity-board/ActivityBoard';
import Banner from '../components/banner/banner';
import { useEffect } from 'react';
import { Engagement } from 'next/font/google';
import PostEngagement from '../components/activity/post/post-engagement/PostEngagement';
export default function Home() {

    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <div className="center w-full overflow-y-auto p-8">
{/*                 <Banner/> */}
                <PostEngagement/>
            </div>
{/*             <div className="right-side relative">
                {<WeatherSummarySide />}
            </div> */}
        </>
    )
}