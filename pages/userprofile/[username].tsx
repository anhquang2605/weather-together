import Head from "next/head";
import { getUserDataByUserName, getUsernamePaths} from "../../libs/users";
import { GetStaticProps, GetStaticPaths } from 'next'
import { useEffect, useRef, useState } from 'react';
import { User } from "../../types/User";
import Summary from "../../components/profile/summary/Summary";
import ProfileBanner from "../../components/profile/profile-banner/ProfileBanner";
import Bio from "../../components/profile/bio/Bio";
import { useSession } from "next-auth/react";
import style from './user-profile.module.scss'
import SkyScroller from "../../components/profile/sky-scroller/SkyScroller";
import { debounce } from "lodash";
import { profile } from "console";
/* import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from './../../store/features/user/userSlice'; */
interface UserProfileProps {
    username: string;
    userJSON: any;
  }

export const getStaticProps: GetStaticProps = async ({ params }) =>  {
    const theuser = await getUserDataByUserName(params?.username as string);
    return {
      props: {
        userJSON: JSON.stringify(theuser),
      },
    };

   
  }
/* export const getStaticPaths : GetStaticPaths = async () => {
    const paths = getUserIds();
    return {
        paths,
        fallback: false,
    };
} */
export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await getUsernamePaths()
    return {
      paths,
      fallback: false
    }
  }
export default function UserProfile({userJSON}:UserProfileProps){
  const user:User = JSON.parse(userJSON);
  const theTitle = `Profile for ${user.username}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState(
    {width: 0, height: 0}
  );
  const dimensionRef = useRef(dimension)
  let resizeTimeout: NodeJS.Timeout | null = null;
  const handleSettingDimensionWhenResize = () => {
    const profilePage = document.querySelector(`.${style['profile-page']}`);
    if(containerRef.current && profilePage){
/*       setDimension({
        width: containerRef.current.clientWidth,
        height: containerRef.current.scrollHeight
      }); */
      const padding = profilePage.clientWidth - profilePage.scrollWidth;
      dimensionRef.current = {
        width: profilePage.clientWidth,
        height: containerRef.current.clientHeight + padding
      }
    }
  }
  useEffect(() => {
    handleSettingDimensionWhenResize();
    const resizeObserver = new ResizeObserver(entries => {
      if(resizeTimeout){
        clearTimeout(resizeTimeout);
      }
      console.log('resize', );
      resizeTimeout = setTimeout(() => {
        for(let entry of entries){
          //const {scrollHeight} = entry.target;
          const {width, height} = entry.contentRect;
          const profilePage = document.querySelector(`.${style['profile-page']}`);
          if(profilePage){
            const padding = profilePage.clientWidth - profilePage.scrollWidth;
            const profileWidth = profilePage.clientWidth;
/*             setDimension({
              width,
              height
              //height: scrollHeight
            }); */
            setDimension({
              width: profileWidth,
              height: height + padding
            })
          }
         
          
        }
      },500)
      
    })
    if(containerRef.current){
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      if(containerRef.current){ 
        resizeObserver.unobserve(containerRef.current)
      }
    }
  }, []);
  useEffect(() =>
  {
    dimensionRef.current = dimension;
  },[dimension])
    return (
        <>
            <Head>
                <title>{theTitle}</title>
            </Head>
            <div ref={profileRef} className={`${style['profile-page']}  ${style[user.featuredWeather?.name || '']}`}>
              <div ref={containerRef}  className={style["top-layer"]}>
                {/* <ProfileBanner user={user} isEditing={false} /> */}
                <p className='whitespace-pre-line'>
                Weather, in its simplest definition, refers to the short-term changes in atmospheric conditions of a specific place at a specific time. These conditions include temperature, humidity, precipitation, wind, and visibility. Weather varies daily and is influenced by a myriad of factors ranging from ocean currents to altitude.

One of the most common and impactful types of weather phenomena is precipitation, which comes in various forms such as rain, snow, sleet, and hail. Rain, essential for all forms of life, plays a vital role in replenishing freshwater sources and maintaining the ecosystem's balance. In contrast, excessive or minimal rainfall can lead to problems like floods or droughts, affecting agriculture, infrastructure, and even leading to loss of life.

Temperature is another crucial aspect of weather. Warm conditions can be inviting, encouraging outdoor activities and providing the needed warmth for crops to grow. On the other hand, extremely high temperatures can lead to heatwaves, which can be dangerous and even fatal for vulnerable populations. Cold temperatures herald snow in many regions, which, while picturesque and vital for certain ecosystems, can also pose challenges in terms of mobility, infrastructure, and energy consumption.

Wind, an often overlooked component, plays an essential role in weather patterns. Gentle breezes can be refreshing on a warm day, while strong winds can be destructive, leading to events such as hurricanes or tornadoes.

In a broader sense, weather has shaped human civilization for millennia. Our ancestors chose their habitats based on local weather patterns, and even today, many of our daily decisions, from the clothes we wear to the activities we engage in, are influenced by the weather. Furthermore, as global climates change, understanding and adapting to new weather patterns will be crucial for future generations. Weather not only affects our daily lives but also holds a profound influence over the planet's ecosystems, economies, and cultures.
                </p>
                <p className='whitespace-pre-line'>
                Weather, in its simplest definition, refers to the short-term changes in atmospheric conditions of a specific place at a specific time. These conditions include temperature, humidity, precipitation, wind, and visibility. Weather varies daily and is influenced by a myriad of factors ranging from ocean currents to altitude.

One of the most common and impactful types of weather phenomena is precipitation, which comes in various forms such as rain, snow, sleet, and hail. Rain, essential for all forms of life, plays a vital role in replenishing freshwater sources and maintaining the ecosystem's balance. In contrast, excessive or minimal rainfall can lead to problems like floods or droughts, affecting agriculture, infrastructure, and even leading to loss of life.

Temperature is another crucial aspect of weather. Warm conditions can be inviting, encouraging outdoor activities and providing the needed warmth for crops to grow. On the other hand, extremely high temperatures can lead to heatwaves, which can be dangerous and even fatal for vulnerable populations. Cold temperatures herald snow in many regions, which, while picturesque and vital for certain ecosystems, can also pose challenges in terms of mobility, infrastructure, and energy consumption.

Wind, an often overlooked component, plays an essential role in weather patterns. Gentle breezes can be refreshing on a warm day, while strong winds can be destructive, leading to events such as hurricanes or tornadoes.

In a broader sense, weather has shaped human civilization for millennia. Our ancestors chose their habitats based on local weather patterns, and even today, many of our daily decisions, from the clothes we wear to the activities we engage in, are influenced by the weather. Furthermore, as global climates change, understanding and adapting to new weather patterns will be crucial for future generations. Weather not only affects our daily lives but also holds a profound influence over the planet's ecosystems, economies, and cultures.
                </p>
                <p className='whitespace-pre-line'>
                Weather, in its simplest definition, refers to the short-term changes in atmospheric conditions of a specific place at a specific time. These conditions include temperature, humidity, precipitation, wind, and visibility. Weather varies daily and is influenced by a myriad of factors ranging from ocean currents to altitude.

One of the most common and impactful types of weather phenomena is precipitation, which comes in various forms such as rain, snow, sleet, and hail. Rain, essential for all forms of life, plays a vital role in replenishing freshwater sources and maintaining the ecosystem's balance. In contrast, excessive or minimal rainfall can lead to problems like floods or droughts, affecting agriculture, infrastructure, and even leading to loss of life.

Temperature is another crucial aspect of weather. Warm conditions can be inviting, encouraging outdoor activities and providing the needed warmth for crops to grow. On the other hand, extremely high temperatures can lead to heatwaves, which can be dangerous and even fatal for vulnerable populations. Cold temperatures herald snow in many regions, which, while picturesque and vital for certain ecosystems, can also pose challenges in terms of mobility, infrastructure, and energy consumption.

Wind, an often overlooked component, plays an essential role in weather patterns. Gentle breezes can be refreshing on a warm day, while strong winds can be destructive, leading to events such as hurricanes or tornadoes.

In a broader sense, weather has shaped human civilization for millennia. Our ancestors chose their habitats based on local weather patterns, and even today, many of our daily decisions, from the clothes we wear to the activities we engage in, are influenced by the weather. Furthermore, as global climates change, understanding and adapting to new weather patterns will be crucial for future generations. Weather not only affects our daily lives but also holds a profound influence over the planet's ecosystems, economies, and cultures.
                </p>
                <p className='whitespace-pre-line'>
                Weather, in its simplest definition, refers to the short-term changes in atmospheric conditions of a specific place at a specific time. These conditions include temperature, humidity, precipitation, wind, and visibility. Weather varies daily and is influenced by a myriad of factors ranging from ocean currents to altitude.

One of the most common and impactful types of weather phenomena is precipitation, which comes in various forms such as rain, snow, sleet, and hail. Rain, essential for all forms of life, plays a vital role in replenishing freshwater sources and maintaining the ecosystem's balance. In contrast, excessive or minimal rainfall can lead to problems like floods or droughts, affecting agriculture, infrastructure, and even leading to loss of life.

Temperature is another crucial aspect of weather. Warm conditions can be inviting, encouraging outdoor activities and providing the needed warmth for crops to grow. On the other hand, extremely high temperatures can lead to heatwaves, which can be dangerous and even fatal for vulnerable populations. Cold temperatures herald snow in many regions, which, while picturesque and vital for certain ecosystems, can also pose challenges in terms of mobility, infrastructure, and energy consumption.

Wind, an often overlooked component, plays an essential role in weather patterns. Gentle breezes can be refreshing on a warm day, while strong winds can be destructive, leading to events such as hurricanes or tornadoes.

In a broader sense, weather has shaped human civilization for millennia. Our ancestors chose their habitats based on local weather patterns, and even today, many of our daily decisions, from the clothes we wear to the activities we engage in, are influenced by the weather. Furthermore, as global climates change, understanding and adapting to new weather patterns will be crucial for future generations. Weather not only affects our daily lives but also holds a profound influence over the planet's ecosystems, economies, and cultures.
                </p>
                <p className='whitespace-pre-line'>
                Weather, in its simplest definition, refers to the short-term changes in atmospheric conditions of a specific place at a specific time. These conditions include temperature, humidity, precipitation, wind, and visibility. Weather varies daily and is influenced by a myriad of factors ranging from ocean currents to altitude.

One of the most common and impactful types of weather phenomena is precipitation, which comes in various forms such as rain, snow, sleet, and hail. Rain, essential for all forms of life, plays a vital role in replenishing freshwater sources and maintaining the ecosystem's balance. In contrast, excessive or minimal rainfall can lead to problems like floods or droughts, affecting agriculture, infrastructure, and even leading to loss of life.

Temperature is another crucial aspect of weather. Warm conditions can be inviting, encouraging outdoor activities and providing the needed warmth for crops to grow. On the other hand, extremely high temperatures can lead to heatwaves, which can be dangerous and even fatal for vulnerable populations. Cold temperatures herald snow in many regions, which, while picturesque and vital for certain ecosystems, can also pose challenges in terms of mobility, infrastructure, and energy consumption.

Wind, an often overlooked component, plays an essential role in weather patterns. Gentle breezes can be refreshing on a warm day, while strong winds can be destructive, leading to events such as hurricanes or tornadoes.

In a broader sense, weather has shaped human civilization for millennia. Our ancestors chose their habitats based on local weather patterns, and even today, many of our daily decisions, from the clothes we wear to the activities we engage in, are influenced by the weather. Furthermore, as global climates change, understanding and adapting to new weather patterns will be crucial for future generations. Weather not only affects our daily lives but also holds a profound influence over the planet's ecosystems, economies, and cultures.
                </p>
                <p className='whitespace-pre-line'>
                Weather, in its simplest definition, refers to the short-term changes in atmospheric conditions of a specific place at a specific time. These conditions include temperature, humidity, precipitation, wind, and visibility. Weather varies daily and is influenced by a myriad of factors ranging from ocean currents to altitude.

One of the most common and impactful types of weather phenomena is precipitation, which comes in various forms such as rain, snow, sleet, and hail. Rain, essential for all forms of life, plays a vital role in replenishing freshwater sources and maintaining the ecosystem's balance. In contrast, excessive or minimal rainfall can lead to problems like floods or droughts, affecting agriculture, infrastructure, and even leading to loss of life.

Temperature is another crucial aspect of weather. Warm conditions can be inviting, encouraging outdoor activities and providing the needed warmth for crops to grow. On the other hand, extremely high temperatures can lead to heatwaves, which can be dangerous and even fatal for vulnerable populations. Cold temperatures herald snow in many regions, which, while picturesque and vital for certain ecosystems, can also pose challenges in terms of mobility, infrastructure, and energy consumption.

Wind, an often overlooked component, plays an essential role in weather patterns. Gentle breezes can be refreshing on a warm day, while strong winds can be destructive, leading to events such as hurricanes or tornadoes.

In a broader sense, weather has shaped human civilization for millennia. Our ancestors chose their habitats based on local weather patterns, and even today, many of our daily decisions, from the clothes we wear to the activities we engage in, are influenced by the weather. Furthermore, as global climates change, understanding and adapting to new weather patterns will be crucial for future generations. Weather not only affects our daily lives but also holds a profound influence over the planet's ecosystems, economies, and cultures.
                </p>
                <p className='whitespace-pre-line'>
                Weather, in its simplest definition, refers to the short-term changes in atmospheric conditions of a specific place at a specific time. These conditions include temperature, humidity, precipitation, wind, and visibility. Weather varies daily and is influenced by a myriad of factors ranging from ocean currents to altitude.

One of the most common and impactful types of weather phenomena is precipitation, which comes in various forms such as rain, snow, sleet, and hail. Rain, essential for all forms of life, plays a vital role in replenishing freshwater sources and maintaining the ecosystem's balance. In contrast, excessive or minimal rainfall can lead to problems like floods or droughts, affecting agriculture, infrastructure, and even leading to loss of life.

Temperature is another crucial aspect of weather. Warm conditions can be inviting, encouraging outdoor activities and providing the needed warmth for crops to grow. On the other hand, extremely high temperatures can lead to heatwaves, which can be dangerous and even fatal for vulnerable populations. Cold temperatures herald snow in many regions, which, while picturesque and vital for certain ecosystems, can also pose challenges in terms of mobility, infrastructure, and energy consumption.

Wind, an often overlooked component, plays an essential role in weather patterns. Gentle breezes can be refreshing on a warm day, while strong winds can be destructive, leading to events such as hurricanes or tornadoes.

In a broader sense, weather has shaped human civilization for millennia. Our ancestors chose their habitats based on local weather patterns, and even today, many of our daily decisions, from the clothes we wear to the activities we engage in, are influenced by the weather. Furthermore, as global climates change, understanding and adapting to new weather patterns will be crucial for future generations. Weather not only affects our daily lives but also holds a profound influence over the planet's ecosystems, economies, and cultures.
                </p>
                <p className='whitespace-pre-line'>
                Weather, in its simplest definition, refers to the short-term changes in atmospheric conditions of a specific place at a specific time. These conditions include temperature, humidity, precipitation, wind, and visibility. Weather varies daily and is influenced by a myriad of factors ranging from ocean currents to altitude.

One of the most common and impactful types of weather phenomena is precipitation, which comes in various forms such as rain, snow, sleet, and hail. Rain, essential for all forms of life, plays a vital role in replenishing freshwater sources and maintaining the ecosystem's balance. In contrast, excessive or minimal rainfall can lead to problems like floods or droughts, affecting agriculture, infrastructure, and even leading to loss of life.

Temperature is another crucial aspect of weather. Warm conditions can be inviting, encouraging outdoor activities and providing the needed warmth for crops to grow. On the other hand, extremely high temperatures can lead to heatwaves, which can be dangerous and even fatal for vulnerable populations. Cold temperatures herald snow in many regions, which, while picturesque and vital for certain ecosystems, can also pose challenges in terms of mobility, infrastructure, and energy consumption.

Wind, an often overlooked component, plays an essential role in weather patterns. Gentle breezes can be refreshing on a warm day, while strong winds can be destructive, leading to events such as hurricanes or tornadoes.

In a broader sense, weather has shaped human civilization for millennia. Our ancestors chose their habitats based on local weather patterns, and even today, many of our daily decisions, from the clothes we wear to the activities we engage in, are influenced by the weather. Furthermore, as global climates change, understanding and adapting to new weather patterns will be crucial for future generations. Weather not only affects our daily lives but also holds a profound influence over the planet's ecosystems, economies, and cultures.
                </p>
              </div>

              <SkyScroller layersNumber={1} profileDimension={dimensionRef.current} />
            </div>
        </>
    )
}