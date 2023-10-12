import Head from 'next/head';
import WeatherSummarySide from '../components/weather-widgets/weather-summary-side/weathersummaryside';
import ActivityBoard from '../components/activity-board/ActivityBoard';
import Banner from '../components/banner/banner';
import PostEngagement from '../components/activity/post/post-engagement/PostEngagement';
import { getSession } from 'next-auth/react';
import { fetchFromGetAPI, insertToPostAPI } from '../libs/api-interactions';
import { useEffect } from 'react';
import FeedsBoard from '../components/activity/feed/FeedsBoard';
import { FeedContextProvider } from '../components/activity/feed/FeedsContext';
interface HomeProps {
    feeds: any;
    hasMore: boolean;
    username: string;
    apiStatus: string;
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
    let results = {
        success: false,
        feeds: [],
        hasMore: false
    }
    const usernames = await getBuddiesUsernames(username);
    if(usernames.length > 0 && usernames){
        results = await getFeedsByUsernames(usernames, username);

    }
   
    const props:HomeProps = {
        feeds: [],
        hasMore: false,
        username: "",
        apiStatus: 'failed'
    }
    if( results && results.success){
        //get list of unique usernames from this list of feeds from results.feeds

        props.feeds = results.feeds;
        props.hasMore = results.hasMore;
        props.username = username;
        props.apiStatus = 'success';
    }
    return {
       props
    }
}
export default function Home(props: any) {
    const {feeds, hasMore, username, apiStatus} = props;
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
                    {
                        apiStatus === 'success'
                        &&
                        <FeedContextProvider>
                            <FeedsBoard
                                username={username}
                                initialFeeds={feeds}
                            />
                        </FeedContextProvider>
                    }
                    {
                        apiStatus === 'failed'
                        &&
                        <div className="text-center text-2xl font-bold text-gray-500">
                            Failed to load feeds
                        </div>
                    }
                    {

                    }
                    
            </div>
{/*             <div className="right-side relative">
                {<WeatherSummarySide />}
            </div> */}
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
        throw new Error(res.message);
    }
}
const getFeedsByUsernames = async (usernames: string[], username:string) => {
    const path = 'feeds';
    const finalUsernames = usernames.join(',');
    const params = {
        usernames: finalUsernames,
        username
    }

    const res = await fetchFromGetAPI(path, params);
    if(res.success){
        return res;
    }else{
        return null;
    }
}