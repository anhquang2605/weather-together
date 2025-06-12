import Head from 'next/head';
import WeatherSummarySide from '../components/weather-widgets/weather-summary-side/weathersummaryside';
import ActivityBoard from '../components/activity-board/ActivityBoard';
import Banner from '../components/banner/banner';
import PostEngagement from '../components/activity/post/post-engagement/PostEngagement';
import { getSession } from 'next-auth/react';
import { fetchFromGetAPI, insertToPostAPI } from '../libs/api-interactions';
import { use, useEffect } from 'react';
import FeedsBoard, { getFeedsByUsernames } from '../components/activity/feed/FeedsBoard';
import { FeedContextProvider, useFeedContext } from '../components/activity/feed/FeedsContext';
import { Feed, FeedGroup } from '../types/Feed';
interface HomeProps {
    username: string;
    apiStatus: string;
    buddiesUsernames: string[];
}
interface Result{
    success: boolean;
    feedGroups: FeedGroup[];
    hasMore: boolean;
    lastCursor: Date;
}
export async function getServerSideProps(context: any) {
   const session = await getSession(context);//need to provide context for the session
   let username = "";
   if(!session){
         return {
              props: {
                feeds: [],
                hasMore: false,
                username: "",
                apiStatus: 'failed'
              }
         }     
   }
    username = session?.user?.username || "";   
    let results:Result = {
        success: true,
        feedGroups: [],
        hasMore: false,
        lastCursor: new Date()
    }
    const usernames = await getBuddiesUsernames(username);
    if(usernames.length > 0 && usernames){
        results = await getFeedsByUsernames(usernames, username);

    }
   
    const props:HomeProps = {
        username: "",
        apiStatus: 'idle',
        buddiesUsernames: []
    }
    if( results && results.success){
        //get list of unique usernames from this list of feeds from results.feeds
        props.username = username;
        props.apiStatus = 'success';
        props.buddiesUsernames = usernames;
    }
    return {
       props
    }
}
export default function Home( props: any) {

    const {username, apiStatus = 'idle',buddiesUsernames} = props;
    return (
        <>
            <Head>
                <title>Weather Together</title>
            </Head>
            <div className="center w-full overflow-y-auto p-8">
                    <PostEngagement
                        username={username}
                    />
                    {
                        apiStatus === 'idle'
                        &&
                        <div className="text-center text-2xl font-bold slate-200 px-16 py-8">
                            Loading feeds...
                        </div>
                    } 
                    {
                        apiStatus === 'success'
                        &&
                        <FeedContextProvider>
                            <FeedsBoard
                                username={username}
      
                                buddiesUsernames={buddiesUsernames}
                            />
                        </FeedContextProvider>
                    }
                    {
                        apiStatus === 'failed'
                        &&
                        <div className="text-center text-2xl font-bold slate-200">
                            Failed to load feeds
                        </div>
                    }
                    {

                    }
                    
            </div>
        </>
    )
}
const getBuddiesUsernames = async (username: string) => {
    const path = 'buddy/usernames';
    const params = {
        username: username
    }
    const res = await fetchFromGetAPI(path, params);
    if(res.success){
        return res.data;
    }else{
        return [];
    }
}
