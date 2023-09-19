import Head from 'next/head';
import WeatherSummarySide from '../components/weather-widgets/weather-summary-side/weathersummaryside';
import ActivityBoard from '../components/activity-board/ActivityBoard';
import Banner from '../components/banner/banner';
import { useEffect } from 'react';
import { Engagement } from 'next/font/google';
import PostEngagement from '../components/activity/post/post-engagement/PostEngagement';
import { useSession } from 'next-auth/react';
import { PostFormProvider } from '../components/activity/post/post-engagement/usePostFormContext';
export default function Home() {
    const {data: session} = useSession();
    const username = session?.user?.username || "";
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <div className="center w-full overflow-y-auto p-8">
{/*                 <Banner/> */}

                    <PostEngagement
                        username={username}
                    />
            </div>
{/*             <div className="right-side relative">
                {<WeatherSummarySide />}
            </div> */}
        </>
    )
}