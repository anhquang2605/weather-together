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
import CityLandScape from "../../components/profile/city-landscape/CityLandscape";
import ParalaxScroller from "../../components/plugins/paralax-scroller/ParalaxScroller";
import ParalaxSection from "../../components/plugins/paralax-scroller/paralax-section/ParalaxSection";
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

const sections = [
  'about_me',
  'bio',
  'activity'
]
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
      setDimension({
        width: profilePage.clientWidth,
        height: containerRef.current.clientHeight + padding
      })
    }
  }
  const getDimensionOfContainer = () => {
      const editProfilePage = document.querySelector(`.${style['edit-profile']}`);
      if(editProfilePage){
        return {
          width: editProfilePage.clientWidth,
          height: editProfilePage.clientHeight
        }
      }else{
        return {
          width: 0,
          height: 0
        }
      }
  }
  useEffect(() => {
    //handleSettingDimensionWhenResize();
    const resizeObserver = new ResizeObserver(entries => {
      if(resizeTimeout){
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        for(let entry of entries){
          //const {scrollHeight} = entry.target;
          const {width, height} = entry.contentRect;
          const profilePage = document.querySelector(`.${style['profile-page']}`);
          if(profilePage){
            const padding = profilePage.clientWidth - width;
            const profileWidth = profilePage.clientWidth;
/*             setDimension({
              width,
              height
              //height: scrollHeight
            });  */
            setDimension({
              width: profileWidth,
              height: height + padding
            })
          }
         
          
        }
      },1000)
      
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
                <div className={style['profile-banner-wrapper']}>
                  <ProfileBanner user={user} isEditing={false} />
                </div>
                
                 <ParalaxScroller
                  introAnimationHandlersMap={{
                    'about_me': () => {
                      console.log('abou');
                    },
                    bio: () => {
                      console.log('bio');
                    },
                    activity: () => {
                      console.log('activity');
                    }
                  }}
                  secctionIds={sections}
                  snapToSections={true}
                  scrollSpeed={0.5}
                  scrollClassName={style['profile-page']}
                 >
                    {
                      sections.map((section, index) => {
                        return (
                          <ParalaxSection
                            key={index}
                            id={section}
                            className=""
                          > 
                            {section[0].toUpperCase() + section.slice(1)}
                          </ParalaxSection>
                        )
                      })
                    }
                 </ParalaxScroller>
                 <CityLandScape />
              </div>

              <SkyScroller parentClassName={style['profile-page']} layersNumber={2} cloudClassName={style['cloud']} skyClassName={style[user.featuredWeather?.name || '']} profileDimension={dimension} />
             
            </div>
        </>
    )
}
