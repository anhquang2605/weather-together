import Head from 'next/head';
import WeatherSummarySide from '../components/weather-widgets/weather-summary-side/weathersummaryside';
import ActivityBoard from '../components/activity-board/ActivityBoard';
import Banner from '../components/banner/banner';
import { useEffect } from 'react';
import { Engagement } from 'next/font/google';
import PostEngagement from '../components/activity/post/post-engagement/PostEngagement';
import { useSession, getSession } from 'next-auth/react';
import { PostFormProvider } from '../components/activity/post/post-engagement/usePostFormContext';
import { fetchFromGetAPI } from '../libs/api-interactions';
export async function getStaticProps() {
   const session = await getSession();
   if(session){
         console.log(session)
   }
    const results = await getFeedsByUsername("anhquang2605");
    return {
        props: {
            feeds: results.feeds,
            hasMore: results.hasMore
        }
    }
}
export default function Home(props: any) {
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
const getFeedsByUsername = async (username: string) => {
    const path = 'feeds';
    const params = {
        username: username
    }
    const res = await fetchFromGetAPI(path, params);
    if(res.success){
        return res;
    }
}